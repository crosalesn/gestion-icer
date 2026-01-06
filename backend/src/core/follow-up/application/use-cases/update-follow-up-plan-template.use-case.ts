import { Inject, Injectable } from '@nestjs/common';
import { FollowUpPlanTemplate } from '../../domain/entities/follow-up-plan-template.entity';
import { IFollowUpPlanTemplateRepository } from '../../domain/repositories/follow-up-plan-template.repository.interface';
import { UpdateFollowUpPlanTemplateDto } from '../dto/update-follow-up-plan-template.dto';

@Injectable()
export class UpdateFollowUpPlanTemplateUseCase {
  constructor(
    @Inject('IFollowUpPlanTemplateRepository')
    private readonly repository: IFollowUpPlanTemplateRepository,
  ) {}

  async execute(id: string, dto: UpdateFollowUpPlanTemplateDto): Promise<FollowUpPlanTemplate> {
    const template = await this.repository.findById(id);
    if (!template) {
      throw new Error(`Template with ID ${id} not found`);
    }

    // Check code uniqueness if code is being updated
    if (dto.code && dto.code !== template.code) {
      const existing = await this.repository.findByCode(dto.code);
      if (existing) {
        throw new Error(`Template with code ${dto.code} already exists`);
      }
    }

    if (dto.name) template.name = dto.name;
    if (dto.code) template.code = dto.code;
    if (dto.targetRiskLevel) template.targetRiskLevel = dto.targetRiskLevel;
    if (dto.durationDays) template.durationDays = dto.durationDays;
    if (dto.meetingFrequencyDays) template.meetingFrequencyDays = dto.meetingFrequencyDays;
    if (dto.meetingCount) template.meetingCount = dto.meetingCount;
    if (dto.description !== undefined) template.description = dto.description;
    
    template.updatedAt = new Date();

    return this.repository.update(template);
  }
}

