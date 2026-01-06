import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IActionPlanRepository } from '../../domain/repositories/action-plan.repository.interface';
import type { ICollaboratorRepository } from '../../../collaborators/domain/repositories/collaborator.repository.interface';
import { ActionPlan } from '../../domain/entities/action-plan.entity';

@Injectable()
export class GetCollaboratorActionPlansUseCase {
  constructor(
    @Inject('IActionPlanRepository')
    private readonly actionPlanRepository: IActionPlanRepository,
    @Inject('ICollaboratorRepository')
    private readonly collaboratorRepository: ICollaboratorRepository,
  ) {}

  async execute(collaboratorId: string): Promise<ActionPlan[]> {
    // collaboratorId is UUID - need to get internal ID for FK lookups
    const collaborator = await this.collaboratorRepository.findById(collaboratorId);
    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }
    if (!collaborator.internalId) {
      throw new Error('Collaborator internal ID not available');
    }
    return this.actionPlanRepository.findByCollaboratorId(collaborator.internalId);
  }
}

