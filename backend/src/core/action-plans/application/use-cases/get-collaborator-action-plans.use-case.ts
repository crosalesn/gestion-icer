import { Inject, Injectable } from '@nestjs/common';
import type { IActionPlanRepository } from '../../domain/repositories/action-plan.repository.interface';
import { ActionPlan } from '../../domain/entities/action-plan.entity';

@Injectable()
export class GetCollaboratorActionPlansUseCase {
  constructor(
    @Inject('IActionPlanRepository')
    private readonly actionPlanRepository: IActionPlanRepository,
  ) {}

  async execute(collaboratorId: string): Promise<ActionPlan[]> {
    return this.actionPlanRepository.findByCollaboratorId(collaboratorId);
  }
}

