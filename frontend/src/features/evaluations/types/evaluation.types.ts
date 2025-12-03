export enum EvaluationType {
  DAY_1 = 'DAY_1',
  WEEK_1_COLLABORATOR = 'WEEK_1_COLLABORATOR',
  WEEK_1_LEADER = 'WEEK_1_LEADER',
  MONTH_1_COLLABORATOR = 'MONTH_1_COLLABORATOR',
  MONTH_1_LEADER = 'MONTH_1_LEADER',
}

export enum EvaluationStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export interface Evaluation {
  id: string;
  collaboratorId: string;
  type: EvaluationType;
  status: EvaluationStatus;
  answers: Record<string, number | string>;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface CreateEvaluationPayload {
  collaboratorId: string;
  type: EvaluationType;
}

export interface SubmitEvaluationPayload {
  answers: Record<string, number | string>;
}

