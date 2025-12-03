import { EvaluationTemplate } from '../entities/evaluation-template.entity';
import { EvaluationMilestone } from '../value-objects/evaluation-milestone.enum';
import { TargetRole } from '../value-objects/target-role.enum';

export interface IEvaluationTemplateRepository {
  save(template: EvaluationTemplate): Promise<void>;
  findById(id: string): Promise<EvaluationTemplate | null>;
  findByMilestoneAndRole(
    milestone: EvaluationMilestone,
    targetRole: TargetRole,
  ): Promise<EvaluationTemplate | null>;
  findAll(): Promise<EvaluationTemplate[]>;
  findActiveByMilestoneAndRole(
    milestone: EvaluationMilestone,
    targetRole: TargetRole,
  ): Promise<EvaluationTemplate | null>;
}

