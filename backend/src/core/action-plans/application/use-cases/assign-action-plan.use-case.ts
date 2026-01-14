import { Inject, Injectable, ConflictException } from '@nestjs/common';
import type { IActionPlanRepository } from '../../domain/repositories/action-plan.repository.interface';
import { ActionPlan } from '../../domain/entities/action-plan.entity';
import { AssignActionPlanCommand } from '../commands/assign-action-plan.command';

@Injectable()
export class AssignActionPlanUseCase {
  constructor(
    @Inject('IActionPlanRepository')
    private readonly actionPlanRepository: IActionPlanRepository,
  ) {}

  async execute(command: AssignActionPlanCommand): Promise<ActionPlan> {
    // Check if there is already an active plan for this collaborator
    const activePlan =
      await this.actionPlanRepository.findActiveByCollaboratorId(
        command.collaboratorId,
      );

    if (activePlan) {
      throw new ConflictException(
        'Collaborator already has an active action plan. Complete or cancel it before assigning a new one.',
      );
    }

    const actionPlan = ActionPlan.create(
      command.collaboratorId,
      command.type,
      command.description,
      command.goals,
      command.dueDate,
    );

    const savedActionPlan = await this.actionPlanRepository.save(actionPlan);

    return savedActionPlan;
  }
}
