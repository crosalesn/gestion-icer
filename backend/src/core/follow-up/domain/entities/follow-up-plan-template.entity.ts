import { RiskLevel } from '../../../collaborators/domain/value-objects/risk-level.enum';

export class FollowUpPlanTemplate {
  constructor(
    public readonly id: string,
    public name: string,
    public code: string,
    public targetRiskLevel: RiskLevel,
    public durationDays: number,
    public meetingFrequencyDays: number,
    public meetingCount: number,
    public description?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  static create(
    name: string,
    code: string,
    targetRiskLevel: RiskLevel,
    durationDays: number,
    meetingFrequencyDays: number,
    meetingCount: number,
    description?: string,
  ): FollowUpPlanTemplate {
    // ID will be assigned by the database (auto-increment)
    return new FollowUpPlanTemplate(
      '', // Empty ID for new entities, will be assigned by DB
      name,
      code,
      targetRiskLevel,
      durationDays,
      meetingFrequencyDays,
      meetingCount,
      description,
      new Date(),
      new Date(),
    );
  }
}
