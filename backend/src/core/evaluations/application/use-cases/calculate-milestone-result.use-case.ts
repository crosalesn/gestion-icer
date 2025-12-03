import { Injectable, Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import type { IEvaluationAssignmentRepository } from '../../domain/repositories/evaluation-assignment.repository.interface';
import type { IMilestoneResultRepository } from '../../domain/repositories/milestone-result.repository.interface';
import type { IEvaluationTemplateRepository } from '../../domain/repositories/evaluation-template.repository.interface';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { TargetRole } from '../../domain/value-objects/target-role.enum';
import { ScoreCalculatorFactory } from '../../domain/services/score-calculation/score-calculator-factory';
import { MilestoneResult } from '../../domain/entities/milestone-result.entity';
import { EvaluationAssignment } from '../../domain/entities/evaluation-assignment.entity';
import { RiskCalculatorService } from '../../domain/services/risk-calculator.service';
import { RiskLevel } from '../../../collaborators/domain/value-objects/risk-level.enum';

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
  ) {}

  async execute(
    collaboratorId: string,
    milestone: EvaluationMilestone,
  ): Promise<MilestoneResult | null> {
    this.logger.log(
      `Calculating milestone result for collaborator ${collaboratorId}, milestone ${milestone}`,
    );

    // Get all assignments for this collaborator and milestone
    const assignments = await this.assignmentRepository.findByCollaboratorAndMilestone(
      collaboratorId,
      milestone,
    );

    if (assignments.length === 0) {
      this.logger.warn(`No assignments found for collaborator ${collaboratorId}, milestone ${milestone}`);
      return null;
    }

    // Get the appropriate calculation strategy
    const strategy = ScoreCalculatorFactory.create(milestone);

    // Check if we can calculate the result
    if (!strategy.canCalculate(assignments)) {
      this.logger.log(
        `Cannot calculate result yet: not all required evaluations are completed`,
      );
      return null;
    }

    // Calculate the final score
    const calculationResult = strategy.calculate(assignments);

    // Calculate risk level
    const riskLevel = RiskCalculatorService.calculateRiskFromScore(
      calculationResult.finalScore,
    );

    // Find assignment IDs by checking templates
    let collaboratorAssignment: EvaluationAssignment | null = null;
    let teamLeaderAssignment: EvaluationAssignment | null = null;

    for (const assignment of assignments) {
      const template = await this.templateRepository.findById(assignment.templateId);
      if (template) {
        if (template.targetRole === TargetRole.COLLABORATOR) {
          collaboratorAssignment = assignment;
        } else if (template.targetRole === TargetRole.TEAM_LEADER) {
          teamLeaderAssignment = assignment;
        }
      }
    }

    // Check if result already exists
    const existingResult = await this.milestoneResultRepository.findByCollaboratorAndMilestone(
      collaboratorId,
      milestone,
    );

    if (existingResult) {
      this.logger.warn(`Milestone result already exists for collaborator ${collaboratorId}, milestone ${milestone}`);
      return existingResult;
    }

    // Create milestone result
    const milestoneResult = MilestoneResult.create(
      uuidv4(),
      collaboratorId,
      milestone,
      collaboratorAssignment?.id || null,
      teamLeaderAssignment?.id || null,
      calculationResult.finalScore,
      riskLevel,
      calculationResult.calculationFormula,
    );

    await this.milestoneResultRepository.save(milestoneResult);

    this.logger.log(
      `Milestone result calculated: score ${calculationResult.finalScore}, risk ${riskLevel}`,
    );

    // Note: Action plan creation is handled in updateCollaboratorRisk to avoid duplicates

    return milestoneResult;
  }
}

