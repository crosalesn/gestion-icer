import { Injectable, Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
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
      // Deactivate the old template (we'd need a method to do this)
      // For now, create a new template with incremented version
      const questions = command.questions
        ? command.questions.map((q, index) =>
            Question.create(
              q.id || uuidv4(), // Use existing ID if provided
              q.text,
              q.dimension,
              q.type,
              q.order || index + 1,
              q.required !== undefined ? q.required : true,
            ),
          )
        : existingTemplate.questions;

      const newTemplate = EvaluationTemplate.create(
        uuidv4(),
        existingTemplate.milestone,
        existingTemplate.targetRole,
        command.title || existingTemplate.title,
        command.description !== undefined
          ? command.description
          : existingTemplate.description,
        questions,
        existingTemplate.version + 1,
      );

      await this.templateRepository.save(newTemplate);

      // TODO: Deactivate old template (would need to add this method to entity)
      this.logger.log(
        `New version ${newTemplate.version} created for template ${command.templateId}`,
      );
      return newTemplate;
    }

    // Update existing template in place
    // Note: Since our entity is immutable, we'd need to create a new one
    // For now, we'll recreate it with updated values
    const questions = command.questions
      ? command.questions.map((q, index) =>
          Question.create(
            q.id || uuidv4(),
            q.text,
            q.dimension,
            q.type,
            q.order || index + 1,
            q.required !== undefined ? q.required : true,
          ),
        )
      : existingTemplate.questions;

    // Reconstitute with updated values
    const updatedTemplate = EvaluationTemplate.reconstitute(
      existingTemplate.id,
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
      new Date(), // Updated at
    );

    await this.templateRepository.save(updatedTemplate);

    this.logger.log(`Template ${command.templateId} updated`);
    return updatedTemplate;
  }
}

