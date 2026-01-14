import { Inject, Injectable } from '@nestjs/common';
import type { ICollaboratorRepository } from '../../../collaborators/domain/repositories/collaborator.repository.interface';
import type { IEvaluationAssignmentRepository } from '../../../evaluations/domain/repositories/evaluation-assignment.repository.interface';
import type { IActionPlanRepository } from '../../../action-plans/domain/repositories/action-plan.repository.interface';
import { RiskLevel } from '../../../collaborators/domain/value-objects/risk-level.enum';
import { ActionPlanStatus } from '../../../action-plans/domain/value-objects/action-plan-status.enum';
import { EvaluationStatus } from '../../../evaluations/domain/value-objects/evaluation-status.enum';
import { formatDateOnly } from '../../../../common/utils/date.utils';

export interface DashboardStats {
  totalCollaborators: number;
  activeEvaluations: number;
  activeActionPlans: number;
  averageScore: number | null;
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
    none: number;
  };
  highRiskCollaborators: any[]; // Simplified collaborator view
}

@Injectable()
export class GetDashboardStatsUseCase {
  constructor(
    @Inject('ICollaboratorRepository')
    private readonly collaboratorRepository: ICollaboratorRepository,
    @Inject('IEvaluationAssignmentRepository')
    private readonly evaluationRepository: IEvaluationAssignmentRepository,
    @Inject('IActionPlanRepository')
    private readonly actionPlanRepository: IActionPlanRepository,
  ) {}

  async execute(): Promise<DashboardStats> {
    const [collaborators, pendingEvaluations, allActionPlans] =
      await Promise.all([
        this.collaboratorRepository.findAll(),
        this.evaluationRepository.findAllPending(),
        this.actionPlanRepository.findAll(),
      ]);

    // Count active action plans
    const activeActionPlans = allActionPlans.filter(
      (ap) => ap.status === ActionPlanStatus.ACTIVE,
    ).length;

    // Calculate average score from completed evaluations
    // We need to get all evaluations to calculate average score
    let totalScore = 0;
    let completedCount = 0;
    for (const collaborator of collaborators) {
      if (collaborator.id === null) continue; // Skip unsaved entities
      const evaluations =
        await this.evaluationRepository.findByCollaboratorId(collaborator.id);
      for (const evaluation of evaluations) {
        if (
          evaluation.status === EvaluationStatus.COMPLETED &&
          evaluation.score !== null
        ) {
          totalScore += evaluation.score;
          completedCount++;
        }
      }
    }
    const averageScore =
      completedCount > 0
        ? Math.round((totalScore / completedCount) * 100) / 100
        : null;

    const stats: DashboardStats = {
      totalCollaborators: collaborators.length,
      activeEvaluations: pendingEvaluations.length,
      activeActionPlans,
      averageScore,
      riskDistribution: {
        high: 0,
        medium: 0,
        low: 0,
        none: 0,
      },
      highRiskCollaborators: [],
    };

    collaborators.forEach((c) => {
      switch (c.riskLevel) {
        case RiskLevel.HIGH:
          stats.riskDistribution.high++;
          stats.highRiskCollaborators.push({
            id: c.id,
            name: c.name,
            project: c.project,
            riskLevel: c.riskLevel,
            admissionDate: formatDateOnly(c.admissionDate),
          });
          break;
        case RiskLevel.MEDIUM:
          stats.riskDistribution.medium++;
          break;
        case RiskLevel.LOW:
          stats.riskDistribution.low++;
          break;
        default:
          stats.riskDistribution.none++;
          break;
      }
    });

    return stats;
  }
}
