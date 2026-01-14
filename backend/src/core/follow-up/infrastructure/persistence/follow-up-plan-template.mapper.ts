import { FollowUpPlanTemplate } from '../../domain/entities/follow-up-plan-template.entity';
import { FollowUpPlanTemplateOrmEntity } from './follow-up-plan-template.orm-entity';

export class FollowUpPlanTemplateMapper {
  static toDomain(
    ormEntity: FollowUpPlanTemplateOrmEntity,
  ): FollowUpPlanTemplate {
    return new FollowUpPlanTemplate(
      String(ormEntity.id),
      ormEntity.name,
      ormEntity.code,
      ormEntity.targetRiskLevel,
      ormEntity.durationDays,
      ormEntity.meetingFrequencyDays,
      ormEntity.meetingCount,
      ormEntity.description ?? undefined,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  static toPersistence(
    domainEntity: FollowUpPlanTemplate,
  ): FollowUpPlanTemplateOrmEntity {
    const ormEntity = new FollowUpPlanTemplateOrmEntity();
    if (domainEntity.id) {
      ormEntity.id = Number(domainEntity.id);
    }
    ormEntity.name = domainEntity.name;
    ormEntity.code = domainEntity.code;
    ormEntity.targetRiskLevel = domainEntity.targetRiskLevel;
    ormEntity.durationDays = domainEntity.durationDays;
    ormEntity.meetingFrequencyDays = domainEntity.meetingFrequencyDays;
    ormEntity.meetingCount = domainEntity.meetingCount;
    ormEntity.description = domainEntity.description || null;
    ormEntity.createdAt = domainEntity.createdAt || new Date();
    ormEntity.updatedAt = domainEntity.updatedAt || new Date();
    return ormEntity;
  }
}
