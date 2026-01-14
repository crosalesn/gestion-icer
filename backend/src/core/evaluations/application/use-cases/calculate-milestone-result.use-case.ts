import { Injectable, Inject, Logger } from '@nestjs/common';
import type { IEvaluationAssignmentRepository } from '../../domain/repositories/evaluation-assignment.repository.interface';
import type { IMilestoneResultRepository } from '../../domain/repositories/milestone-result.repository.interface';
import type { IEvaluationTemplateRepository } from '../../domain/repositories/evaluation-template.repository.interface';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { TargetRole } from '../../domain/value-objects/target-role.enum';
import { ScoreCalculatorFactory } from '../../domain/services/score-calculation/score-calculator-factory';
import { MilestoneResult } from '../../domain/entities/milestone-result.entity';
import { EvaluationAssignment } from '../../domain/entities/evaluation-assignment.entity';
import { RiskCalculatorService } from '../../domain/services/risk-calculator.service';
import { AssignmentWithRole } from '../../domain/services/score-calculation/calculation-strategy.interface';
import { AssignFollowUpPlanUseCase } from '../../../follow-up/application/use-cases/assign-follow-up-plan.use-case';
import { AssignFollowUpPlanCommand } from '../../../follow-up/application/commands/assign-follow-up-plan.command';

@Injectable()
export class CalculateMilestoneResultUseCase {
  private readonly logger = new Logger(CalculateMilestoneResultUseCase.name);

  constructor(
    @Inject('IEvaluationAssignmentRepository')
    private readonly assignmentRepository: IEvaluationAssignmentRepository,
    @Inject('IMilestoneResultRepository')
    private readonly milestoneResultRepository: IMilestoneResultRepository,
    @Inject('IEvaluationTemplateRepository')
    private readonly templateRepository: IEvaluationTemplateRepository,
    private readonly assignFollowUpPlanUseCase: AssignFollowUpPlanUseCase,
  ) {}

  async execute(
    collaboratorId: number,
    milestone: EvaluationMilestone,
  ): Promise<MilestoneResult | null> {
    this.logger.log(
      `Calculating milestone result for collaborator ${collaboratorId}, milestone ${milestone}`,
    );

    // Get all assignments for this collaborator and milestone
    const assignments =
      await this.assignmentRepository.findByCollaboratorAndMilestone(
        collaboratorId,
        milestone,
      );

    if (assignments.length === 0) {
      this.logger.warn(
        `No assignments found for collaborator ${collaboratorId}, milestone ${milestone}`,
      );
      return null;
    }

    // Enrich assignments with role information from templates
    const assignmentsWithRoles: AssignmentWithRole[] = [];
    let collaboratorAssignment: EvaluationAssignment | null = null;
    let teamLeaderAssignment: EvaluationAssignment | null = null;

    for (const assignment of assignments) {
      const template = await this.templateRepository.findById(
        assignment.templateId,
      );
      if (template) {
        assignmentsWithRoles.push({
          assignment,
          role: template.targetRole,
        });

        if (template.targetRole === TargetRole.COLLABORATOR) {
          collaboratorAssignment = assignment;
        } else if (template.targetRole === TargetRole.TEAM_LEADER) {
          teamLeaderAssignment = assignment;
        }
      } else {
        this.logger.warn(`Template not found for assignment ${assignment.id}`);
      }
    }

    // Get the appropriate calculation strategy
    const strategy = ScoreCalculatorFactory.create(milestone);

    // Check if we can calculate the result
    if (!strategy.canCalculate(assignmentsWithRoles)) {
      this.logger.log(
        `Cannot calculate result yet: not all required evaluations are completed`,
      );
      return null;
    }

    // Calculate the final score
    const calculationResult = strategy.calculate(assignmentsWithRoles);

    // Calculate risk level
    const riskLevel =
      calculationResult.determinedRiskLevel ||
      RiskCalculatorService.calculateRiskFromScore(
        calculationResult.finalScore,
      );

    // Check if result already exists
    const existingResult =
      await this.milestoneResultRepository.findByCollaboratorAndMilestone(
        collaboratorId,
        milestone,
      );

    if (existingResult) {
      this.logger.warn(
        `Milestone result already exists for collaborator ${collaboratorId}, milestone ${milestone}`,
      );
      return existingResult;
    }

    // Create milestone result
    const milestoneResult = MilestoneResult.create(
      collaboratorId,
      milestone,
      collaboratorAssignment?.id || null,
      teamLeaderAssignment?.id || null,
      calculationResult.finalScore,
      riskLevel,
      calculationResult.calculationFormula,
    );

    const savedResult =
      await this.milestoneResultRepository.save(milestoneResult);

    this.logger.log(
      `Milestone result calculated: score ${calculationResult.finalScore}, risk ${riskLevel}`,
    );

    // TRIGGER AUTOMATIC FOLLOW-UP PLAN ASSIGNMENT (Only for Month 1)
    if (milestone === EvaluationMilestone.MONTH_1) {
      this.assignFollowUpPlanUseCase
        .execute(new AssignFollowUpPlanCommand(collaboratorId, riskLevel))
        .catch((error: unknown) => {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          const errorStack = error instanceof Error ? error.stack : undefined;
          this.logger.error(
            `Failed to auto-assign follow-up plan: ${errorMessage}`,
            errorStack,
          );
        });
    }

    return savedResult;
  }
}
