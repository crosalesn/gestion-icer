import { Injectable, Inject, Logger } from '@nestjs/common';
import type { IEvaluationTemplateRepository } from '../../domain/repositories/evaluation-template.repository.interface';
import { EvaluationTemplate } from '../../domain/entities/evaluation-template.entity';

@Injectable()
export class GetAllTemplatesUseCase {
  private readonly logger = new Logger(GetAllTemplatesUseCase.name);

  constructor(
    @Inject('IEvaluationTemplateRepository')
    private readonly templateRepository: IEvaluationTemplateRepository,
  ) {}

  async execute(): Promise<EvaluationTemplate[]> {
    this.logger.log('Getting all templates');
    return this.templateRepository.findAll();
  }
}
