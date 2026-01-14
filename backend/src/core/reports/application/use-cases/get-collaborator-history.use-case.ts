import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ICollaboratorRepository } from '../../../collaborators/domain/repositories/collaborator.repository.interface';
import type { IEvaluationAssignmentRepository } from '../../../evaluations/domain/repositories/evaluation-assignment.repository.interface';
import type { IActionPlanRepository } from '../../../action-plans/domain/repositories/action-plan.repository.interface';
import { formatDateOnly } from '../../../../common/utils/date.utils';

export interface CollaboratorHistoryReport {
  collaborator: {
    id: number | null;
    name: string;
    role: string;
    project: string;
    admissionDate: string;
    riskLevel: string;
    status: string;
  };
  evaluations: {
    id: number | null;
    type: string;
    score: number | null;
    status: string;
    createdAt: string;
    completedAt: string | null;
  }[];
  activeActionPlan: {
    id: number | null;
    type: string;
    description: string;
    dueDate: string;
  } | null;
}

@Injectable()
export class GetCollaboratorHistoryUseCase {
  constructor(
    @Inject('ICollaboratorRepository')
    private readonly collaboratorRepository: ICollaboratorRepository,
    @Inject('IEvaluationAssignmentRepository')
    private readonly assignmentRepository: IEvaluationAssignmentRepository,
    @Inject('IActionPlanRepository')
    private readonly actionPlanRepository: IActionPlanRepository,
  ) {}

  async execute(collaboratorId: number): Promise<CollaboratorHistoryReport> {
    const collaborator =
      await this.collaboratorRepository.findById(collaboratorId);

    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    const assignments =
      await this.assignmentRepository.findByCollaboratorId(collaboratorId);

    const evaluations = assignments.map((a) => ({
      id: a.id,
      type: a.milestone,
      score: a.score,
      status: a.status,
      createdAt: formatDateOnly(a.createdAt),
      completedAt: a.completedAt ? formatDateOnly(a.completedAt) : null,
    }));

    const activePlan =
      await this.actionPlanRepository.findActiveByCollaboratorId(
        collaboratorId,
      );

    return {
      collaborator: {
        id: collaborator.id,
        name: collaborator.name,
        role: collaborator.role,
        project: collaborator.project,
        admissionDate: formatDateOnly(collaborator.admissionDate),
        riskLevel: collaborator.riskLevel,
        status: collaborator.status,
      },
      evaluations,
      activeActionPlan: activePlan
        ? {
            id: activePlan.id,
            type: activePlan.type,
            description: activePlan.description,
            dueDate: formatDateOnly(activePlan.dueDate),
          }
        : null,
    };
  }
}
