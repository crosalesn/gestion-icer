import { Injectable, Inject, Logger } from '@nestjs/common';
import { SubmitAssignmentAnswersCommand } from '../commands/submit-assignment-answers.command';
import type { IEvaluationAssignmentRepository } from '../../domain/repositories/evaluation-assignment.repository.interface';
import type { IEvaluationTemplateRepository } from '../../domain/repositories/evaluation-template.repository.interface';
import { EvaluationAssignment } from '../../domain/entities/evaluation-assignment.entity';
import { EvaluationAnswer } from '../../domain/entities/evaluation-assignment.entity';
import { EvaluationStatus } from '../../domain/value-objects/evaluation-status.enum';
import { QuestionType } from '../../domain/value-objects/question-type.enum';
import { Question } from '../../domain/entities/question.entity';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { AssignEvaluationUseCase } from './assign-evaluation.use-case';
import { AssignEvaluationCommand } from '../commands/assign-evaluation.command';
import type { ICollaboratorRepository } from '../../../collaborators/domain/repositories/collaborator.repository.interface';
import { Collaborator } from '../../../collaborators/domain/entities/collaborator.entity';
import { RiskCalculatorService } from '../../domain/services/risk-calculator.service';
import { RiskLevel } from '../../../collaborators/domain/value-objects/risk-level.enum';
import { AssignActionPlanUseCase } from '../../../action-plans/application/use-cases/assign-action-plan.use-case';
import { AssignActionPlanCommand } from '../../../action-plans/application/commands/assign-action-plan.command';
import { ActionPlanType } from '../../../action-plans/domain/value-objects/action-plan-type.enum';
import { CalculateMilestoneResultUseCase } from './calculate-milestone-result.use-case';

@Injectable()
export class SubmitAssignmentAnswersUseCase {
  private readonly logger = new Logger(SubmitAssignmentAnswersUseCase.name);

  constructor(
    @Inject('IEvaluationAssignmentRepository')
    private readonly assignmentRepository: IEvaluationAssignmentRepository,
    @Inject('IEvaluationTemplateRepository')
    private readonly templateRepository: IEvaluationTemplateRepository,
    @Inject('ICollaboratorRepository')
    private readonly collaboratorRepository: ICollaboratorRepository,
    private readonly assignEvaluationUseCase: AssignEvaluationUseCase,
    private readonly assignActionPlanUseCase: AssignActionPlanUseCase,
    private readonly calculateMilestoneResultUseCase: CalculateMilestoneResultUseCase,
  ) {}

  async execute(command: SubmitAssignmentAnswersCommand): Promise<EvaluationAssignment> {
    this.logger.log(`Submitting answers for assignment ${command.assignmentId}`);

    const assignment = await this.assignmentRepository.findById(command.assignmentId);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    if (assignment.status === EvaluationStatus.COMPLETED) {
      throw new Error('Assignment is already completed');
    }

    // Get template to validate answers
    const template = await this.templateRepository.findById(assignment.templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Validate answers
    this.validateAnswers(command.answers, template.questions);

    // Calculate individual score (average of scale questions only)
    const score = this.calculateIndividualScore(command.answers, template.questions);

    // Complete the assignment
    assignment.complete(command.answers, score);

    await this.assignmentRepository.save(assignment);

    this.logger.log(`Assignment ${command.assignmentId} completed with score ${score}`);

    // Update collaborator risk level directly from this evaluation
    // The risk level is always updated to reflect the latest evaluation
    try {
      // assignment.collaboratorId is the internal numeric ID (as string)
      // We need to lookup the collaborator by internal ID to get the UUID for other operations
      const collaborator = await this.collaboratorRepository.findByInternalId(
        assignment.collaboratorId,
      );
      if (!collaborator) {
        throw new Error(`Collaborator with internal ID ${assignment.collaboratorId} not found`);
      }

      await this.updateCollaboratorRisk(
        collaborator,
        score,
        assignment.milestone,
      );
      
      // Calculate and create milestone result for display in collaborator detail
      // This creates the consolidated result that shows in the UI
      try {
        // Use the internal ID for milestone result (as it uses numeric ID for FK)
        await this.calculateMilestoneResultUseCase.execute(
          assignment.collaboratorId,
          assignment.milestone,
        );
        this.logger.log(
          `Milestone result calculated for collaborator ${collaborator.id}, milestone ${assignment.milestone}`,
        );
      } catch (error) {
        // Log but don't fail if milestone result calculation fails
        // This can happen if not all required evaluations are completed yet
        this.logger.warn(
          `Failed to calculate milestone result: ${error.message}`,
        );
      }
      
      // Create next evaluation automatically - use UUID for AssignEvaluationCommand
      await this.createNextEvaluation(collaborator.id, assignment.milestone);
    } catch (error) {
      // Log but don't fail the submission if risk update or next evaluation creation fails
      this.logger.warn(
        `Failed to update collaborator risk or create next evaluation: ${error.message}`,
      );
    }

    return assignment;
  }

  private async createNextEvaluation(
    collaboratorId: string,
    currentMilestone: EvaluationMilestone,
  ): Promise<void> {
    // Check if there are other pending assignments for the current milestone
    // We only advance to the next milestone when ALL assignments for the current one are completed
    const currentMilestoneAssignments = await this.assignmentRepository.findByCollaboratorAndMilestone(
      collaboratorId,
      currentMilestone,
    );
    
    const hasPending = currentMilestoneAssignments.some(
      (a) => a.status !== EvaluationStatus.COMPLETED
    );

    if (hasPending) {
      this.logger.log(`There are still pending assignments for milestone ${currentMilestone}. Next milestone will not be created yet.`);
      return;
    }

    let nextMilestone: EvaluationMilestone | null = null;

    // Determine next milestone
    if (currentMilestone === EvaluationMilestone.DAY_1) {
      nextMilestone = EvaluationMilestone.WEEK_1;
    } else if (currentMilestone === EvaluationMilestone.WEEK_1) {
      nextMilestone = EvaluationMilestone.MONTH_1;
    }
    // If MONTH_1, no next milestone (end of cycle)

    if (!nextMilestone) {
      this.logger.log(`No next milestone after ${currentMilestone}`);
      return;
    }

    try {
      const command = new AssignEvaluationCommand(collaboratorId, nextMilestone);
      await this.assignEvaluationUseCase.execute(command);
      this.logger.log(
        `Automatically created next evaluation: ${nextMilestone} for collaborator ${collaboratorId}`,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to create next evaluation ${nextMilestone}: ${error.message}`,
      );
    }
  }

  private validateAnswers(
    answers: EvaluationAnswer[],
    questions: Question[],
  ): void {
    const requiredQuestionIds = questions
      .filter((q) => q.required)
      .map((q) => q.id);

    const answeredQuestionIds = answers.map((a) => a.questionId);

    const missingRequired = requiredQuestionIds.filter(
      (id) => !answeredQuestionIds.includes(id),
    );

    if (missingRequired.length > 0) {
      throw new Error(
        `Missing required answers for questions: ${missingRequired.join(', ')}`,
      );
    }

    // Validate answer values
    for (const answer of answers) {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) {
        throw new Error(`Question ${answer.questionId} not found in template`);
      }

      if (question.type === QuestionType.SCALE_1_4) {
        if (typeof answer.value !== 'number' || answer.value < 1 || answer.value > 4) {
          throw new Error(
            `Invalid answer value for question ${answer.questionId}: must be between 1 and 4`,
          );
        }
      }
    }
  }

  private calculateIndividualScore(
    answers: EvaluationAnswer[],
    questions: Question[],
  ): number {
    const scaleAnswers = answers.filter((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      return question && question.type === QuestionType.SCALE_1_4 && typeof answer.value === 'number';
    });

    if (scaleAnswers.length === 0) {
      return 0;
    }

    const totalScore = scaleAnswers.reduce(
      (sum, answer) => sum + (answer.value as number),
      0,
    );

    return Math.round((totalScore / scaleAnswers.length) * 10) / 10; // Round to 1 decimal
  }

  /**
   * Updates the collaborator's risk level based on the evaluation score.
   * The risk level is always updated to reflect the latest evaluation.
   * Automatically creates action plans for HIGH or MEDIUM risk levels.
   */
  private async updateCollaboratorRisk(
    collaborator: Collaborator,
    score: number,
    milestone: EvaluationMilestone,
  ): Promise<void> {
    // Calculate risk level from score
    const riskLevel = RiskCalculatorService.calculateRiskFromScore(score);

    // Update collaborator's risk level (always overwrites previous risk level)
    collaborator.updateRiskLevel(riskLevel);
    await this.collaboratorRepository.save(collaborator);

    this.logger.log(
      `Updated collaborator ${collaborator.id} risk level to ${riskLevel} based on score ${score}`,
    );

    // Create automatic action plan if risk is HIGH or MEDIUM
    // Use UUID for action plan creation
    await this.handleActionPlanCreation(collaborator.id, riskLevel, milestone, score);
  }

  /**
   * Creates an automatic action plan based on the risk level.
   * Only creates plans for HIGH or MEDIUM risk levels.
   */
  private async handleActionPlanCreation(
    collaboratorId: string,
    riskLevel: RiskLevel,
    milestone: EvaluationMilestone,
    score: number,
  ): Promise<void> {
    // Only create action plans for HIGH or MEDIUM risk
    if (riskLevel === RiskLevel.LOW || riskLevel === RiskLevel.NONE) {
      this.logger.log(
        `Risk level ${riskLevel} does not require automatic action plan creation`,
      );
      return;
    }

    try {
      let actionPlanType: ActionPlanType;
      let description: string;
      let goals: string[];

      if (riskLevel === RiskLevel.HIGH) {
        actionPlanType = ActionPlanType.PD_30;
        description = `Plan de Desarrollo 30 días - Riesgo Alto detectado en evaluación ${milestone}. Puntaje: ${score.toFixed(2)}`;
        goals = [
          'Identificar y resolver bloqueos críticos detectados',
          'Clarificar funciones y expectativas del rol',
        ];
      } else if (riskLevel === RiskLevel.MEDIUM) {
        actionPlanType = ActionPlanType.PDF_30;
        description = `Mini Plan de Fortalecimiento 30 días - Riesgo Medio detectado en evaluación ${milestone}. Puntaje: ${score.toFixed(2)}`;
        goals = [
          'Abordar brechas técnicas identificadas',
          'Reforzar aspectos conductuales y de comunicación',
        ];
      } else {
        return; // Should not reach here, but just in case
      }

      // Calculate due date (30 days from now)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);

      const command = new AssignActionPlanCommand(
        collaboratorId,
        actionPlanType,
        description,
        goals,
        dueDate,
      );

      await this.assignActionPlanUseCase.execute(command);

      this.logger.log(
        `Automatic action plan ${actionPlanType} created for collaborator ${collaboratorId}`,
      );
    } catch (error) {
      // Log but don't fail the risk update if action plan creation fails
      // This can happen if there's already an active plan
      this.logger.warn(
        `Failed to create automatic action plan: ${error.message}`,
      );
    }
  }
}

