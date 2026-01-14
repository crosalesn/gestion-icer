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

  async execute(collaboratorId: number): Promise<ActionPlan[]> {
    const collaborator =
      await this.collaboratorRepository.findById(collaboratorId);
    if (!collaborator) {
      throw new NotFoundException('Collaborator not found');
    }
    return this.actionPlanRepository.findByCollaboratorId(collaboratorId);
  }
}
