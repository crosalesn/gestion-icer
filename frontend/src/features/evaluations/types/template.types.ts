export enum EvaluationMilestone {
  DAY_1 = 'DAY_1',
  WEEK_1 = 'WEEK_1',
  MONTH_1 = 'MONTH_1',
}

export enum TargetRole {
  COLLABORATOR = 'COLLABORATOR',
  TEAM_LEADER = 'TEAM_LEADER',
}

export enum QuestionDimension {
  INTEGRATION = 'INTEGRATION',
  COMMUNICATION = 'COMMUNICATION',
  ROLE_UNDERSTANDING = 'ROLE_UNDERSTANDING',
  PERFORMANCE = 'PERFORMANCE',
}

export enum QuestionType {
  SCALE_1_4 = 'SCALE_1_4',
  OPEN_TEXT = 'OPEN_TEXT',
}

export enum EvaluationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface Question {
  id: string;
  text: string;
  dimension: QuestionDimension;
  type: QuestionType;
  order: number;
  required: boolean;
}

export interface EvaluationTemplate {
  id: string;
  milestone: EvaluationMilestone;
  targetRole: TargetRole;
  title: string;
  description?: string | null;
  questions: Question[];
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationAnswer {
  questionId: string;
  value: number | string;
}

export interface EvaluationAssignment {
  id: string;
  collaboratorId: string;
  evaluatorUserId: string;
  templateId: string;
  milestone: EvaluationMilestone;
  status: EvaluationStatus;
  dueDate: string;
  completedAt: string | null;
  answers: EvaluationAnswer[];
  score: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PendingEvaluationResponse {
  assignment: EvaluationAssignment;
  template: EvaluationTemplate;
  collaboratorName: string;
  collaboratorProject: string;
}

export interface SubmitAssignmentPayload {
  answers: EvaluationAnswer[];
}

export interface CompletedAssignmentResponse {
  assignment: {
    id: string;
    milestone: EvaluationMilestone;
    status: EvaluationStatus;
    score: number | null;
    completedAt: string | null;
    answers: EvaluationAnswer[];
    createdAt: string;
  };
  template: {
    id: string;
    title: string;
    milestone: EvaluationMilestone;
    questions: Question[];
  };
}

