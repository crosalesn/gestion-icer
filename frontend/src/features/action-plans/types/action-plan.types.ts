export enum ActionPlanType {
  PD_30 = 'PD_30',
  PDF_30 = 'PDF_30',
  SE_60 = 'SE_60',
}

export enum ActionPlanStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface ActionPlan {
  id: number;
  collaboratorId: number;
  type: ActionPlanType;
  description: string;
  status: ActionPlanStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface AssignActionPlanPayload {
  type: ActionPlanType;
  description: string;
  dueDate: string;
}
