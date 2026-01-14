import { Injectable, Inject, Logger } from '@nestjs/common';
import type { IEvaluationAssignmentRepository } from '../../domain/repositories/evaluation-assignment.repository.interface';
import type { IEvaluationTemplateRepository } from '../../domain/repositories/evaluation-template.repository.interface';
import type { ICollaboratorRepository } from '../../../collaborators/domain/repositories/collaborator.repository.interface';
import { EvaluationAssignment } from '../../domain/entities/evaluation-assignment.entity';
import { EvaluationTemplate } from '../../domain/entities/evaluation-template.entity';
import { PendingEvaluationResponseDto } from '../../presentation/dto/pending-evaluation-response.dto';

export interface PendingEvaluationResponse {
  assignment: EvaluationAssignment;
  template: EvaluationTemplate;
  collaboratorName: string;
  collaboratorProject: string;
}

@Injectable()
export class GetPendingEvaluationsUseCase {
  private readonly logger = new Logger(GetPendingEvaluationsUseCase.name);

  constructor(
    @Inject('IEvaluationAssignmentRepository')
    private readonly assignmentRepository: IEvaluationAssignmentRepository,
    @Inject('IEvaluationTemplateRepository')
    private readonly templateRepository: IEvaluationTemplateRepository,
    @Inject('ICollaboratorRepository')
    private readonly collaboratorRepository: ICollaboratorRepository,
  ) {}

  async execute(): Promise<PendingEvaluationResponseDto[]> {
    this.logger.log(`Getting all pending evaluations`);

    const pendingAssignments = await this.assignmentRepository.findAllPending();

    const results: PendingEvaluationResponseDto[] = [];

    for (const assignment of pendingAssignments) {
      const template = await this.templateRepository.findById(
        assignment.templateId,
      );
      const collaborator = await this.collaboratorRepository.findById(
        assignment.collaboratorId,
      );

      if (template && collaborator) {
        results.push(
          PendingEvaluationResponseDto.fromDomain(
            assignment,
            template,
            collaborator.name,
            collaborator.project,
          ),
        );
      }
    }

    this.logger.log(`Found ${results.length} pending evaluation(s)`);
    return results;
  }
}
