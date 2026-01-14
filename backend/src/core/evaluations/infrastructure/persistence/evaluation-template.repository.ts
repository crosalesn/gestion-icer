import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { IEvaluationTemplateRepository } from '../../domain/repositories/evaluation-template.repository.interface';
import { EvaluationTemplate } from '../../domain/entities/evaluation-template.entity';
import { EvaluationTemplateOrmEntity } from './evaluation-template.orm-entity';
import { EvaluationTemplateMapper } from './evaluation-template.mapper';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { TargetRole } from '../../domain/value-objects/target-role.enum';
import { QuestionOrmEntity } from './question.orm-entity';
import { QuestionMapper } from './question.mapper';

@Injectable()
export class PostgresEvaluationTemplateRepository implements IEvaluationTemplateRepository {
  constructor(
    @InjectRepository(EvaluationTemplateOrmEntity)
    private readonly repository: Repository<EvaluationTemplateOrmEntity>,
    @InjectRepository(QuestionOrmEntity)
    private readonly questionRepository: Repository<QuestionOrmEntity>,
  ) {}

  async save(template: EvaluationTemplate): Promise<EvaluationTemplate> {
    // Save the template first (without questions to avoid cascade issues)
    const templateOrm = new EvaluationTemplateOrmEntity();
    if (template.id !== null) {
      templateOrm.id = template.id;
    }
    templateOrm.milestone = template.milestone;
    templateOrm.targetRole = template.targetRole;
    templateOrm.title = template.title;
    templateOrm.description = template.description;
    templateOrm.isActive = template.isActive;
    templateOrm.version = template.version;
    templateOrm.createdAt = template.createdAt;
    templateOrm.updatedAt = template.updatedAt;

    const savedTemplate = await this.repository.save(templateOrm);
    const templateId = savedTemplate.id;

    // Handle questions with soft delete logic
    if (template.questions && template.questions.length >= 0) {
      // Get existing questions for this template
      const existingQuestions = await this.questionRepository.find({
        where: { templateId },
      });

      // Get IDs of questions that should remain active
      const incomingQuestionIds = template.questions
        .filter((q) => q.id && q.id !== '')
        .map((q) => Number(q.id));

      // Soft delete questions that are not in the incoming list
      const questionsToDeactivate = existingQuestions.filter(
        (eq) => !incomingQuestionIds.includes(eq.id) && eq.isActive,
      );

      if (questionsToDeactivate.length > 0) {
        await this.questionRepository.update(
          { id: In(questionsToDeactivate.map((q) => q.id)) },
          { isActive: false },
        );
      }

      // Save/update incoming questions
      for (const question of template.questions) {
        const questionOrm = QuestionMapper.toOrm(question, templateId);
        questionOrm.isActive = true; // Ensure incoming questions are active
        await this.questionRepository.save(questionOrm);
      }
    }

    // Fetch the complete template with questions
    const result = await this.findById(savedTemplate.id);
    return result!;
  }

  async findById(id: number): Promise<EvaluationTemplate | null> {
    const ormEntity = await this.repository.findOne({
      where: { id },
      relations: ['questions', 'questions.dimension'],
    });
    if (!ormEntity) return null;

    // Filter only active questions
    ormEntity.questions = ormEntity.questions?.filter((q) => q.isActive) || [];
    return EvaluationTemplateMapper.toDomain(ormEntity);
  }

  async findByMilestoneAndRole(
    milestone: EvaluationMilestone,
    targetRole: TargetRole,
  ): Promise<EvaluationTemplate | null> {
    const ormEntity = await this.repository.findOne({
      where: { milestone, targetRole },
      relations: ['questions', 'questions.dimension'],
      order: { version: 'DESC' },
    });
    if (!ormEntity) return null;

    // Filter only active questions
    ormEntity.questions = ormEntity.questions?.filter((q) => q.isActive) || [];
    return EvaluationTemplateMapper.toDomain(ormEntity);
  }

  async findAll(): Promise<EvaluationTemplate[]> {
    const ormEntities = await this.repository.find({
      relations: ['questions', 'questions.dimension'],
      order: { createdAt: 'ASC' },
    });
    // Filter only active questions for each template
    return ormEntities.map((orm) => {
      orm.questions = orm.questions?.filter((q) => q.isActive) || [];
      return EvaluationTemplateMapper.toDomain(orm);
    });
  }

  async findActiveByMilestoneAndRole(
    milestone: EvaluationMilestone,
    targetRole: TargetRole,
  ): Promise<EvaluationTemplate | null> {
    const ormEntity = await this.repository.findOne({
      where: { milestone, targetRole, isActive: true },
      relations: ['questions', 'questions.dimension'],
      order: { version: 'DESC' },
    });
    if (!ormEntity) return null;

    // Filter only active questions
    ormEntity.questions = ormEntity.questions?.filter((q) => q.isActive) || [];
    return EvaluationTemplateMapper.toDomain(ormEntity);
  }
}
