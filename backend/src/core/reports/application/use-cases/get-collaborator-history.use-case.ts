import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ICollaboratorRepository } from '../../../collaborators/domain/repositories/collaborator.repository.interface';
import type { IEvaluationRepository } from '../../../evaluations/domain/repositories/evaluation.repository.interface';
import type { IEvaluationAssignmentRepository } from '../../../evaluations/domain/repositories/evaluation-assignment.repository.interface';
import type { IActionPlanRepository } from '../../../action-plans/domain/repositories/action-plan.repository.interface';
import { EvaluationMilestone } from '../../../evaluations/domain/value-objects/evaluation-milestone.enum';
import { EvaluationType } from '../../../evaluations/domain/value-objects/evaluation-type.enum';

export interface CollaboratorHistoryReport {
  collaborator: {
    id: string;
    name: string;
    role: string;
    project: string;
    admissionDate: Date;
    riskLevel: string;
    status: string;
  };
  evaluations: {
    id: string;
    type: string;
    score: number | null;
    status: string;
    date: Date;
  }[];
  activeActionPlan: {
    id: string;
    type: string;
    description: string;
    dueDate: Date;
  } | null;
}

@Injectable()
export class GetCollaboratorHistoryUseCase {
  constructor(
    @Inject('ICollaboratorRepository')
    private readonly collaboratorRepository: ICollaboratorRepository,
    @Inject('IEvaluationRepository')
    private readonly evaluationRepository: IEvaluationRepository,
    @Inject('IEvaluationAssignmentRepository')
    private readonly assignmentRepository: IEvaluationAssignmentRepository,
    @Inject('IActionPlanRepository')
    private readonly actionPlanRepository: IActionPlanRepository,
  ) {}

  async execute(collaboratorId: string): Promise<CollaboratorHistoryReport> {
    const collaborator = await this.collaboratorRepository.findById(
      collaboratorId,
    );

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    const evaluations = await this.evaluationRepository.findByCollaboratorId(
      collaboratorId,
    );

    const assignments = await this.assignmentRepository.findByCollaboratorId(
      collaboratorId,
    );

    const mappedAssignments = assignments.map((a) => ({
      id: a.id,
      type: this.mapMilestoneToType(a.milestone),
      score: a.score,
      status: a.status,
      date: a.completedAt || a.createdAt,
    }));

    const allEvaluations = [
      ...evaluations.map((e) => ({
        id: e.id,
        type: e.type,
        score: e.score,
        status: e.status,
        date: e.completedAt || e.createdAt,
      })),
      ...mappedAssignments,
    ];

    const activePlan = await this.actionPlanRepository.findActiveByCollaboratorId(
      collaboratorId,
    );

    return {
      collaborator: {
        id: collaborator.id,
        name: collaborator.name,
        role: collaborator.role,
        project: collaborator.project,
        admissionDate: collaborator.admissionDate,
        riskLevel: collaborator.riskLevel,
        status: collaborator.status,
      },
      evaluations: allEvaluations,
      activeActionPlan: activePlan
        ? {
            id: activePlan.id,
            type: activePlan.type,
            description: activePlan.description,
            dueDate: activePlan.dueDate,
          }
        : null,
    };
  }

  private mapMilestoneToType(milestone: EvaluationMilestone): string {
    switch (milestone) {
      case EvaluationMilestone.DAY_1:
        return EvaluationType.DAY_1;
      case EvaluationMilestone.WEEK_1:
        return EvaluationType.WEEK_1_COLLABORATOR;
      case EvaluationMilestone.MONTH_1:
        return EvaluationType.MONTH_1_COLLABORATOR;
      default:
        return milestone;
    }
  }
}
