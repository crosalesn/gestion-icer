import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowUpPlanTemplate } from '../../domain/entities/follow-up-plan-template.entity';
import { IFollowUpPlanTemplateRepository } from '../../domain/repositories/follow-up-plan-template.repository.interface';
import { FollowUpPlanTemplateMapper } from './follow-up-plan-template.mapper';
import { FollowUpPlanTemplateOrmEntity } from './follow-up-plan-template.orm-entity';
import { RiskLevel } from '../../../collaborators/domain/value-objects/risk-level.enum';

@Injectable()
export class FollowUpPlanTemplateRepository implements IFollowUpPlanTemplateRepository {
  constructor(
    @InjectRepository(FollowUpPlanTemplateOrmEntity)
    private readonly repository: Repository<FollowUpPlanTemplateOrmEntity>,
  ) {}

  async create(template: FollowUpPlanTemplate): Promise<FollowUpPlanTemplate> {
    const ormEntity = FollowUpPlanTemplateMapper.toPersistence(template);
    const savedEntity = await this.repository.save(ormEntity);
    return FollowUpPlanTemplateMapper.toDomain(savedEntity);
  }

  async findAll(): Promise<FollowUpPlanTemplate[]> {
    const entities = await this.repository.find({
      order: {
        createdAt: 'ASC',
      },
    });
    return entities.map((entity) =>
      FollowUpPlanTemplateMapper.toDomain(entity),
    );
  }

  async findById(id: string): Promise<FollowUpPlanTemplate | null> {
    const entity = await this.repository.findOne({
      where: { id: Number(id) },
    });
    if (!entity) return null;
    return FollowUpPlanTemplateMapper.toDomain(entity);
  }

  async findByCode(code: string): Promise<FollowUpPlanTemplate | null> {
    const entity = await this.repository.findOne({ where: { code } });
    if (!entity) return null;
    return FollowUpPlanTemplateMapper.toDomain(entity);
  }

  async findByRiskLevel(
    riskLevel: string,
  ): Promise<FollowUpPlanTemplate | null> {
    // We assume there's one default template per risk level for now, or just return one
    // Ideally we should have a flag 'isDefault' if we have multiple
    const entity = await this.repository.findOne({
      where: { targetRiskLevel: riskLevel as RiskLevel },
    });
    if (!entity) return null;
    return FollowUpPlanTemplateMapper.toDomain(entity);
  }

  async update(template: FollowUpPlanTemplate): Promise<FollowUpPlanTemplate> {
    const ormEntity = FollowUpPlanTemplateMapper.toPersistence(template);
    const savedEntity = await this.repository.save(ormEntity);
    return FollowUpPlanTemplateMapper.toDomain(savedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(Number(id));
  }
}
