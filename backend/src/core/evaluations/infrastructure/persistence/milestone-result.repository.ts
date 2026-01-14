import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMilestoneResultRepository } from '../../domain/repositories/milestone-result.repository.interface';
import { MilestoneResult } from '../../domain/entities/milestone-result.entity';
import { MilestoneResultOrmEntity } from './milestone-result.orm-entity';
import { MilestoneResultMapper } from './milestone-result.mapper';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';

@Injectable()
export class PostgresMilestoneResultRepository implements IMilestoneResultRepository {
  constructor(
    @InjectRepository(MilestoneResultOrmEntity)
    private readonly repository: Repository<MilestoneResultOrmEntity>,
  ) {}

  async save(result: MilestoneResult): Promise<MilestoneResult> {
    const ormEntity = MilestoneResultMapper.toOrm(result);
    const saved = await this.repository.save(ormEntity);
    return MilestoneResultMapper.toDomain(saved);
  }

  async findById(id: number): Promise<MilestoneResult | null> {
    const ormEntity = await this.repository.findOne({
      where: { id },
    });
    return ormEntity ? MilestoneResultMapper.toDomain(ormEntity) : null;
  }

  async findByCollaboratorId(
    collaboratorId: number,
  ): Promise<MilestoneResult[]> {
    const ormEntities = await this.repository.find({
      where: { collaboratorId },
      order: { calculatedAt: 'ASC' },
    });
    return ormEntities.map((orm) => MilestoneResultMapper.toDomain(orm));
  }

  async findByCollaboratorAndMilestone(
    collaboratorId: number,
    milestone: EvaluationMilestone,
  ): Promise<MilestoneResult | null> {
    const ormEntity = await this.repository.findOne({
      where: { collaboratorId, milestone },
    });
    return ormEntity ? MilestoneResultMapper.toDomain(ormEntity) : null;
  }
}
