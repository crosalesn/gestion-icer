import { Inject, Injectable } from '@nestjs/common';
import { IFollowUpPlanTemplateRepository } from '../../domain/repositories/follow-up-plan-template.repository.interface';

@Injectable()
export class DeleteFollowUpPlanTemplateUseCase {
  constructor(
    @Inject('IFollowUpPlanTemplateRepository')
    private readonly repository: IFollowUpPlanTemplateRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const template = await this.repository.findById(id);
    if (!template) {
      throw new Error(`Template with ID ${id} not found`);
    }
    await this.repository.delete(id);
  }
}
