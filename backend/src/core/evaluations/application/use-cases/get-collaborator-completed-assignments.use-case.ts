import { Injectable, Inject, Logger } from '@nestjs/common';
import type { IEvaluationAssignmentRepository } from '../../domain/repositories/evaluation-assignment.repository.interface';
import type { IEvaluationTemplateRepository } from '../../domain/repositories/evaluation-template.repository.interface';
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
      dimension: string;
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
  ) {}

  async execute(collaboratorId: string): Promise<CompletedAssignmentResponse[]> {
    this.logger.log(`Getting completed assignments for collaborator ${collaboratorId}`);

    // Get all assignments for this collaborator
    const allAssignments = await this.assignmentRepository.findByCollaboratorId(collaboratorId);

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
              dimension: q.dimension,
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

