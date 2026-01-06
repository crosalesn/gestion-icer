import { Inject, Injectable } from '@nestjs/common';
import type { IActionPlanRepository } from '../../domain/repositories/action-plan.repository.interface';
import { ActionPlan } from '../../domain/entities/action-plan.entity';

@Injectable()
export class GetAllActionPlansUseCase {
  constructor(
    @Inject('IActionPlanRepository')
    private readonly actionPlanRepository: IActionPlanRepository,
  ) {}

  async execute(): Promise<ActionPlan[]> {
    return this.actionPlanRepository.findAll();
  }
}

