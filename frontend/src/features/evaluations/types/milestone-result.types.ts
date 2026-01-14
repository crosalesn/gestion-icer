import { EvaluationMilestone } from './template.types';

export enum RiskLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  NONE = 'NONE',
}

export interface MilestoneResult {
  id: number;
  collaboratorId: number;
  milestone: EvaluationMilestone;
  collaboratorAssignmentId: number | null;
  teamLeaderAssignmentId: number | null;
  finalScore: number;
  riskLevel: RiskLevel;
  calculatedAt: string;
  calculationFormula: string;
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneResultWithDetails extends MilestoneResult {
  collaboratorScore?: number;
  teamLeaderScore?: number;
}
