import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IEvaluationTemplateRepository } from '../../domain/repositories/evaluation-template.repository.interface';
import { EvaluationTemplate } from '../../domain/entities/evaluation-template.entity';

@Injectable()
export class GetTemplateByIdUseCase {
  constructor(
    @Inject('IEvaluationTemplateRepository')
    private readonly templateRepository: IEvaluationTemplateRepository,
  ) {}

  async execute(id: number): Promise<EvaluationTemplate> {
    const template = await this.templateRepository.findById(id);
    if (!template) {
      throw new NotFoundException(
        `Evaluation template with ID ${id} not found`,
      );
    }
    return template;
  }
}
