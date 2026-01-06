export enum RiskLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  NONE = 'NONE',
}

export interface FollowUpPlanTemplate {
  id: string;
  name: string;
  code: string;
  targetRiskLevel: RiskLevel;
  durationDays: number;
  meetingFrequencyDays: number;
  meetingCount: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFollowUpPlanTemplateDto {
  name: string;
  code: string;
  targetRiskLevel: RiskLevel;
  durationDays: number;
  meetingFrequencyDays: number;
  meetingCount: number;
  description?: string;
}

