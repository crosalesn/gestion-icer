import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IEvaluationTemplateRepository } from '../../domain/repositories/evaluation-template.repository.interface';
import { EvaluationTemplate } from '../../domain/entities/evaluation-template.entity';
import { EvaluationTemplateOrmEntity } from './evaluation-template.orm-entity';
import { EvaluationTemplateMapper } from './evaluation-template.mapper';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { TargetRole } from '../../domain/value-objects/target-role.enum';

@Injectable()
export class PostgresEvaluationTemplateRepository
  implements IEvaluationTemplateRepository
{
  constructor(
    @InjectRepository(EvaluationTemplateOrmEntity)
    private readonly repository: Repository<EvaluationTemplateOrmEntity>,
  ) {}

  async save(template: EvaluationTemplate): Promise<void> {
    const ormEntity = EvaluationTemplateMapper.toOrm(template);
    await this.repository.save(ormEntity);
  }

  async findById(id: string): Promise<EvaluationTemplate | null> {
    const ormEntity = await this.repository.findOne({
      where: { id },
      relations: ['questions'],
    });
    return ormEntity ? EvaluationTemplateMapper.toDomain(ormEntity) : null;
  }

  async findByMilestoneAndRole(
    milestone: EvaluationMilestone,
    targetRole: TargetRole,
  ): Promise<EvaluationTemplate | null> {
    const ormEntity = await this.repository.findOne({
      where: { milestone, targetRole },
      relations: ['questions'],
      order: { version: 'DESC' },
    });
    return ormEntity ? EvaluationTemplateMapper.toDomain(ormEntity) : null;
  }

  async findAll(): Promise<EvaluationTemplate[]> {
    const ormEntities = await this.repository.find({
      relations: ['questions'],
      order: { createdAt: 'ASC' },
    });
    return ormEntities.map((orm) => EvaluationTemplateMapper.toDomain(orm));
  }

  async findActiveByMilestoneAndRole(
    milestone: EvaluationMilestone,
    targetRole: TargetRole,
  ): Promise<EvaluationTemplate | null> {
    const ormEntity = await this.repository.findOne({
      where: { milestone, targetRole, isActive: true },
      relations: ['questions'],
      order: { version: 'DESC' },
    });
    return ormEntity ? EvaluationTemplateMapper.toDomain(ormEntity) : null;
  }
}

