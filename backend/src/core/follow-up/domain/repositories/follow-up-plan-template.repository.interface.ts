import { FollowUpPlanTemplate } from '../entities/follow-up-plan-template.entity';

export abstract class IFollowUpPlanTemplateRepository {
  abstract create(template: FollowUpPlanTemplate): Promise<FollowUpPlanTemplate>;
  abstract findAll(): Promise<FollowUpPlanTemplate[]>;
  abstract findById(id: string): Promise<FollowUpPlanTemplate | null>;
  abstract findByCode(code: string): Promise<FollowUpPlanTemplate | null>;
  abstract findByRiskLevel(riskLevel: string): Promise<FollowUpPlanTemplate | null>;
  abstract update(template: FollowUpPlanTemplate): Promise<FollowUpPlanTemplate>;
  abstract delete(id: string): Promise<void>;
}
