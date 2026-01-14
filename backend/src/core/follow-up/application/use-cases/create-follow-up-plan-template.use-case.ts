import { Inject, Injectable } from '@nestjs/common';
import { FollowUpPlanTemplate } from '../../domain/entities/follow-up-plan-template.entity';
import { IFollowUpPlanTemplateRepository } from '../../domain/repositories/follow-up-plan-template.repository.interface';
import { CreateFollowUpPlanTemplateDto } from '../dto/create-follow-up-plan-template.dto';

@Injectable()
export class CreateFollowUpPlanTemplateUseCase {
  constructor(
    @Inject('IFollowUpPlanTemplateRepository')
    private readonly repository: IFollowUpPlanTemplateRepository,
  ) {}

  async execute(
    dto: CreateFollowUpPlanTemplateDto,
  ): Promise<FollowUpPlanTemplate> {
    const existing = await this.repository.findByCode(dto.code);
    if (existing) {
      throw new Error(`Template with code ${dto.code} already exists`);
    }

    const template = FollowUpPlanTemplate.create(
      dto.name,
      dto.code,
      dto.targetRiskLevel,
      dto.durationDays,
      dto.meetingFrequencyDays,
      dto.meetingCount,
      dto.description,
    );

    return this.repository.create(template);
  }
}
