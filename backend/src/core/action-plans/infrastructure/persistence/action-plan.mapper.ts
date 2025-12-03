import { ActionPlan } from '../../domain/entities/action-plan.entity';
import { ActionPlanOrmEntity } from './action-plan.orm-entity';

export class ActionPlanMapper {
  static toDomain(orm: ActionPlanOrmEntity): ActionPlan {
    return ActionPlan.reconstitute(
      orm.id,
      orm.collaboratorId,
      orm.type,
      orm.description,
      orm.goals,
      orm.status,
      orm.createdAt,
      orm.updatedAt,
      orm.dueDate,
    );
  }

  static toOrm(domain: ActionPlan): ActionPlanOrmEntity {
    const orm = new ActionPlanOrmEntity();
    orm.id = domain.id;
    orm.collaboratorId = domain.collaboratorId;
    orm.type = domain.type;
    orm.description = domain.description;
    orm.goals = domain.goals;
    orm.status = domain.status;
    orm.dueDate = domain.dueDate;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    return orm;
  }
}

