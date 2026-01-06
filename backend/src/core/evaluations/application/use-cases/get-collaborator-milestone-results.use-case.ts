import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IMilestoneResultRepository } from '../../domain/repositories/milestone-result.repository.interface';
import type { ICollaboratorRepository } from '../../../collaborators/domain/repositories/collaborator.repository.interface';
import { MilestoneResult } from '../../domain/entities/milestone-result.entity';

@Injectable()
export class GetCollaboratorMilestoneResultsUseCase {
  constructor(
    @Inject('IMilestoneResultRepository')
    private readonly milestoneResultRepository: IMilestoneResultRepository,
    @Inject('ICollaboratorRepository')
    private readonly collaboratorRepository: ICollaboratorRepository,
  ) {}

  async execute(collaboratorId: string): Promise<MilestoneResult[]> {
    // collaboratorId is UUID - need to get internal ID for FK lookups
    const collaborator = await this.collaboratorRepository.findById(collaboratorId);
    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }
    if (!collaborator.internalId) {
      throw new Error('Collaborator internal ID not available');
    }
    return this.milestoneResultRepository.findByCollaboratorId(collaborator.internalId);
  }
}



