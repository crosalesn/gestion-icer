import { ActionPlanType } from '../value-objects/action-plan-type.enum';
import { ActionPlanStatus } from '../value-objects/action-plan-status.enum';

export class ActionPlan {
  constructor(
    private _id: number | null, // null for new entities, assigned by DB after save
    private readonly _collaboratorId: number,
    private readonly _type: ActionPlanType,
    private _description: string,
    private _goals: string[], // List of specific goals or gaps to address
    private _status: ActionPlanStatus,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _dueDate: Date,
  ) {}

  get id(): number | null {
    return this._id;
  }

  get collaboratorId(): number {
    return this._collaboratorId;
  }

  get type(): ActionPlanType {
    return this._type;
  }

  get description(): string {
    return this._description;
  }

  get goals(): string[] {
    return this._goals;
  }

  get status(): ActionPlanStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get dueDate(): Date {
    return this._dueDate;
  }

  // Factory method (id will be assigned by DB)
  static create(
    collaboratorId: number,
    type: ActionPlanType,
    description: string,
    goals: string[],
    dueDate: Date,
  ): ActionPlan {
    return new ActionPlan(
      null, // id is null for new entities
      collaboratorId,
      type,
      description,
      goals,
      ActionPlanStatus.ACTIVE,
      new Date(),
      new Date(),
      dueDate,
    );
  }

  // Reconstitute
  static reconstitute(
    id: number,
    collaboratorId: number,
    type: ActionPlanType,
    description: string,
    goals: string[],
    status: ActionPlanStatus,
    createdAt: Date,
    updatedAt: Date,
    dueDate: Date,
  ): ActionPlan {
    return new ActionPlan(
      id,
      collaboratorId,
      type,
      description,
      goals,
      status,
      createdAt,
      updatedAt,
      dueDate,
    );
  }

  complete(): void {
    this._status = ActionPlanStatus.COMPLETED;
    this._updatedAt = new Date();
  }

  cancel(): void {
    this._status = ActionPlanStatus.CANCELLED;
    this._updatedAt = new Date();
  }
}
