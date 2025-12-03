import { Injectable, Inject, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTemplateCommand } from '../commands/create-template.command';
import type { IEvaluationTemplateRepository } from '../../domain/repositories/evaluation-template.repository.interface';
import { EvaluationTemplate } from '../../domain/entities/evaluation-template.entity';
import { Question } from '../../domain/entities/question.entity';

@Injectable()
export class CreateTemplateUseCase {
  private readonly logger = new Logger(CreateTemplateUseCase.name);

  constructor(
    @Inject('IEvaluationTemplateRepository')
    private readonly templateRepository: IEvaluationTemplateRepository,
  ) {}

  async execute(command: CreateTemplateCommand): Promise<EvaluationTemplate> {
    this.logger.log(
      `Creating template for milestone ${command.milestone}, role ${command.targetRole}`,
    );

    // Check if there's already an active template for this milestone and role
    const existingTemplate = await this.templateRepository.findActiveByMilestoneAndRole(
      command.milestone,
      command.targetRole,
    );

    if (existingTemplate) {
      this.logger.warn(
        `Active template already exists for milestone ${command.milestone}, role ${command.targetRole}. Consider updating instead.`,
      );
      // Optionally deactivate the existing one
      // For now, we'll allow multiple active templates but warn
    }

    // Create questions
    const questions = command.questions.map((q, index) =>
      Question.create(
        uuidv4(),
        q.text,
        q.dimension,
        q.type,
        q.order || index + 1,
        q.required !== undefined ? q.required : true,
      ),
    );

    // Create template
    const template = EvaluationTemplate.create(
      uuidv4(),
      command.milestone,
      command.targetRole,
      command.title,
      command.description || null,
      questions,
      1, // First version
    );

    await this.templateRepository.save(template);

    this.logger.log(`Template created with ID: ${template.id}`);
    return template;
  }
}

