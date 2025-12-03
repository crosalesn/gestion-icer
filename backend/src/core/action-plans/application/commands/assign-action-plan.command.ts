import { ActionPlanType } from '../../domain/value-objects/action-plan-type.enum';

export class AssignActionPlanCommand {
  constructor(
    public readonly collaboratorId: string,
    public readonly type: ActionPlanType,
    public readonly description: string,
    public readonly goals: string[],
    public readonly dueDate: Date,
  ) {}
}

