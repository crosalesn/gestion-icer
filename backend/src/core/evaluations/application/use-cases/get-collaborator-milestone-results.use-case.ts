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

  async execute(collaboratorId: number): Promise<MilestoneResult[]> {
    const collaborator =
      await this.collaboratorRepository.findById(collaboratorId);
    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }
    return this.milestoneResultRepository.findByCollaboratorId(collaboratorId);
  }
}
