import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IEvaluationRepository } from '../../domain/repositories/evaluation.repository.interface';
import type { ICollaboratorRepository } from '../../../collaborators/domain/repositories/collaborator.repository.interface';
import { Evaluation } from '../../domain/entities/evaluation.entity';

@Injectable()
export class GetCollaboratorEvaluationsUseCase {
  constructor(
    @Inject('IEvaluationRepository')
    private readonly evaluationRepository: IEvaluationRepository,
    @Inject('ICollaboratorRepository')
    private readonly collaboratorRepository: ICollaboratorRepository,
  ) {}

  async execute(collaboratorId: string): Promise<Evaluation[]> {
    // collaboratorId is UUID - need to get internal ID for FK lookups
    const collaborator = await this.collaboratorRepository.findById(collaboratorId);
    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }
    if (!collaborator.internalId) {
      throw new Error('Collaborator internal ID not available');
    }
    return this.evaluationRepository.findByCollaboratorId(collaborator.internalId);
  }
}

