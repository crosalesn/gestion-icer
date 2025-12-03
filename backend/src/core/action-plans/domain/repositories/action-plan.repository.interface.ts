import { ActionPlan } from '../entities/action-plan.entity';

export interface IActionPlanRepository {
  save(actionPlan: ActionPlan): Promise<void>;
  findById(id: string): Promise<ActionPlan | null>;
  findByCollaboratorId(collaboratorId: string): Promise<ActionPlan[]>;
  findActiveByCollaboratorId(collaboratorId: string): Promise<ActionPlan | null>;
}

