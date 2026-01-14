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

  async save(actionPlan: ActionPlan): Promise<ActionPlan> {
    const ormEntity = ActionPlanMapper.toOrm(actionPlan);
    const saved = await this.repository.save(ormEntity);
    return ActionPlanMapper.toDomain(saved);
  }

  async findById(id: number): Promise<ActionPlan | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? ActionPlanMapper.toDomain(ormEntity) : null;
  }

  async findByCollaboratorId(collaboratorId: number): Promise<ActionPlan[]> {
    const ormEntities = await this.repository.find({
      where: { collaboratorId },
      order: { createdAt: 'DESC' },
    });
    return ormEntities.map((orm) => ActionPlanMapper.toDomain(orm));
  }

  async findActiveByCollaboratorId(
    collaboratorId: number,
  ): Promise<ActionPlan | null> {
    const ormEntity = await this.repository.findOne({
      where: { collaboratorId, status: ActionPlanStatus.ACTIVE },
    });
    return ormEntity ? ActionPlanMapper.toDomain(ormEntity) : null;
  }

  async findAll(): Promise<ActionPlan[]> {
    const ormEntities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return ormEntities.map((orm) => ActionPlanMapper.toDomain(orm));
  }
}
