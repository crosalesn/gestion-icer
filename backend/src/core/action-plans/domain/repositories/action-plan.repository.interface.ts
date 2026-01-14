import { ActionPlan } from '../entities/action-plan.entity';

export interface IActionPlanRepository {
  save(actionPlan: ActionPlan): Promise<ActionPlan>;
  findById(id: number): Promise<ActionPlan | null>;
  findByCollaboratorId(collaboratorId: number): Promise<ActionPlan[]>;
  findActiveByCollaboratorId(
    collaboratorId: number,
  ): Promise<ActionPlan | null>;
  findAll(): Promise<ActionPlan[]>;
}
