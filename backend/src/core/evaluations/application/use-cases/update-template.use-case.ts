import { Injectable, Inject, Logger } from '@nestjs/common';
import { UpdateTemplateCommand } from '../commands/update-template.command';
import type { IEvaluationTemplateRepository } from '../../domain/repositories/evaluation-template.repository.interface';
import { EvaluationTemplate } from '../../domain/entities/evaluation-template.entity';
import { Question } from '../../domain/entities/question.entity';

@Injectable()
export class UpdateTemplateUseCase {
  private readonly logger = new Logger(UpdateTemplateUseCase.name);

  constructor(
    @Inject('IEvaluationTemplateRepository')
    private readonly templateRepository: IEvaluationTemplateRepository,
  ) {}

  async execute(command: UpdateTemplateCommand): Promise<EvaluationTemplate> {
    this.logger.log(`Updating template ${command.templateId}`);

    const existingTemplate = await this.templateRepository.findById(
      command.templateId,
    );

    if (!existingTemplate) {
      throw new Error('Template not found');
    }

    // If createNewVersion is true, deactivate old template and create new one
    if (command.createNewVersion && existingTemplate.isActive) {
      const questions = command.questions
        ? command.questions.map((q, index) =>
            Question.create(
              q.text,
              q.dimensionId,
              q.type,
              q.order || index + 1,
              q.required !== undefined ? q.required : true,
            ),
          )
        : existingTemplate.questions;

      const newTemplate = EvaluationTemplate.create(
        existingTemplate.milestone,
        existingTemplate.targetRole,
        command.title || existingTemplate.title,
        command.description !== undefined
          ? command.description
          : existingTemplate.description,
        questions,
        existingTemplate.version + 1,
      );

      const savedNewTemplate = await this.templateRepository.save(newTemplate);

      this.logger.log(`New version created for template ${command.templateId}`);
      return savedNewTemplate;
    }

    // Update existing template in place
    const questions = command.questions
      ? command.questions.map((q, index) =>
          Question.reconstitute(
            q.id || '',
            q.text,
            q.dimensionId,
            q.type,
            q.order || index + 1,
            q.required !== undefined ? q.required : true,
          ),
        )
      : existingTemplate.questions;

    // Reconstitute with updated values
    const updatedTemplate = EvaluationTemplate.reconstitute(
      existingTemplate.id!,
      existingTemplate.milestone,
      existingTemplate.targetRole,
      command.title || existingTemplate.title,
      command.description !== undefined
        ? command.description
        : existingTemplate.description,
      questions,
      command.isActive !== undefined
        ? command.isActive
        : existingTemplate.isActive,
      existingTemplate.version,
      existingTemplate.createdAt,
      new Date(),
    );

    const savedTemplate = await this.templateRepository.save(updatedTemplate);

    this.logger.log(`Template ${command.templateId} updated`);
    return savedTemplate;
  }
}
