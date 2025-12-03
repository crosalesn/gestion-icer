import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IActionPlanRepository } from '../../domain/repositories/action-plan.repository.interface';
import { ActionPlan } from '../../domain/entities/action-plan.entity';
import { ActionPlanOrmEntity } from './action-plan.orm-entity';
import { ActionPlanMapper } from './action-plan.mapper';
import { ActionPlanStatus } from '../../domain/value-objects/action-plan-status.enum';

@Injectable()
export class PostgresActionPlanRepository implements IActionPlanRepository {
  constructor(
    @InjectRepository(ActionPlanOrmEntity)
    private readonly repository: Repository<ActionPlanOrmEntity>,
  ) {}

  async save(actionPlan: ActionPlan): Promise<void> {
    const ormEntity = ActionPlanMapper.toOrm(actionPlan);
    await this.repository.save(ormEntity);
  }

  async findById(id: string): Promise<ActionPlan | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? ActionPlanMapper.toDomain(ormEntity) : null;
  }

  async findByCollaboratorId(collaboratorId: string): Promise<ActionPlan[]> {
    const ormEntities = await this.repository.find({
      where: { collaboratorId },
      order: { createdAt: 'DESC' },
    });
    return ormEntities.map((orm) => ActionPlanMapper.toDomain(orm));
  }

  async findActiveByCollaboratorId(
    collaboratorId: string,
  ): Promise<ActionPlan | null> {
    const ormEntity = await this.repository.findOne({
      where: { collaboratorId, status: ActionPlanStatus.ACTIVE },
    });
    return ormEntity ? ActionPlanMapper.toDomain(ormEntity) : null;
  }
}

