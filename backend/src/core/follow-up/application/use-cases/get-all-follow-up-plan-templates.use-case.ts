import { Inject, Injectable } from '@nestjs/common';
import { FollowUpPlanTemplate } from '../../domain/entities/follow-up-plan-template.entity';
import { IFollowUpPlanTemplateRepository } from '../../domain/repositories/follow-up-plan-template.repository.interface';

@Injectable()
export class GetAllFollowUpPlanTemplatesUseCase {
  constructor(
    @Inject('IFollowUpPlanTemplateRepository')
    private readonly repository: IFollowUpPlanTemplateRepository,
  ) {}

  async execute(): Promise<FollowUpPlanTemplate[]> {
    return this.repository.findAll();
  }
}
