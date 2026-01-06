import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import type { IEvaluationAssignmentRepository } from '../../domain/repositories/evaluation-assignment.repository.interface';
import type { IEvaluationTemplateRepository } from '../../domain/repositories/evaluation-template.repository.interface';
import type { ICollaboratorRepository } from '../../../collaborators/domain/repositories/collaborator.repository.interface';
import { EvaluationStatus } from '../../domain/value-objects/evaluation-status.enum';

export interface CompletedAssignmentResponse {
  assignment: {
    id: string;
    milestone: string;
    status: string;
    score: number | null;
    completedAt: Date | null;
    answers: Array<{ questionId: string; value: number | string }>;
    createdAt: Date;
  };
  template: {
    id: string;
    title: string;
    milestone: string;
    questions: Array<{
      id: string;
      text: string;
      dimensionId: string;
      dimension?: {
        id: string;
        code: string;
        name: string;
        description: string | null;
      };
      type: string;
      order: number;
    }>;
  };
}

@Injectable()
export class GetCollaboratorCompletedAssignmentsUseCase {
  private readonly logger = new Logger(GetCollaboratorCompletedAssignmentsUseCase.name);

  constructor(
    @Inject('IEvaluationAssignmentRepository')
    private readonly assignmentRepository: IEvaluationAssignmentRepository,
    @Inject('IEvaluationTemplateRepository')
    private readonly templateRepository: IEvaluationTemplateRepository,
    @Inject('ICollaboratorRepository')
    private readonly collaboratorRepository: ICollaboratorRepository,
  ) {}

  async execute(collaboratorId: string): Promise<CompletedAssignmentResponse[]> {
    this.logger.log(`Getting completed assignments for collaborator ${collaboratorId}`);

    // collaboratorId is UUID - need to get internal ID for FK lookups
    const collaborator = await this.collaboratorRepository.findById(collaboratorId);
    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }
    if (!collaborator.internalId) {
      throw new Error('Collaborator internal ID not available');
    }

    // Get all assignments for this collaborator using internal ID
    const allAssignments = await this.assignmentRepository.findByCollaboratorId(collaborator.internalId);

    // Filter only completed assignments
    const completedAssignments = allAssignments.filter(
      (assignment) => assignment.status === EvaluationStatus.COMPLETED,
    );

    const results: CompletedAssignmentResponse[] = [];

    for (const assignment of completedAssignments) {
      const template = await this.templateRepository.findById(assignment.templateId);
      
      if (template) {
        results.push({
          assignment: {
            id: assignment.id,
            milestone: assignment.milestone,
            status: assignment.status,
            score: assignment.score,
            completedAt: assignment.completedAt,
            answers: assignment.answers,
            createdAt: assignment.createdAt,
          },
          template: {
            id: template.id,
            title: template.title,
            milestone: template.milestone,
            questions: template.questions.map((q) => ({
              id: q.id,
              text: q.text,
              dimensionId: q.dimensionId,
              dimension: q.dimension ? {
                id: q.dimension.id,
                code: q.dimension.code,
                name: q.dimension.name,
                description: q.dimension.description,
              } : undefined,
              type: q.type,
              order: q.order,
            })),
          },
        });
      }
    }

    // Sort by completed date (most recent first)
    results.sort((a, b) => {
      const dateA = a.assignment.completedAt?.getTime() || 0;
      const dateB = b.assignment.completedAt?.getTime() || 0;
      return dateB - dateA;
    });

    this.logger.log(`Found ${results.length} completed assignment(s) for collaborator ${collaboratorId}`);
    return results;
  }
}
