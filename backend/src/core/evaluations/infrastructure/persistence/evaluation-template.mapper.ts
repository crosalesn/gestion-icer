import { EvaluationTemplate } from '../../domain/entities/evaluation-template.entity';
import { EvaluationTemplateOrmEntity } from './evaluation-template.orm-entity';
import { QuestionMapper } from './question.mapper';

export class EvaluationTemplateMapper {
  static toDomain(orm: EvaluationTemplateOrmEntity): EvaluationTemplate {
    const questions = orm.questions
      ? orm.questions.map((q) => QuestionMapper.toDomain(q))
      : [];

    return EvaluationTemplate.reconstitute(
      orm.id,
      orm.milestone,
      orm.targetRole,
      orm.title,
      orm.description,
      questions,
      orm.isActive,
      orm.version,
      orm.createdAt,
      orm.updatedAt,
    );
  }

  static toOrm(domain: EvaluationTemplate): EvaluationTemplateOrmEntity {
    const orm = new EvaluationTemplateOrmEntity();
    orm.id = domain.id;
    orm.milestone = domain.milestone;
    orm.targetRole = domain.targetRole;
    orm.title = domain.title;
    orm.description = domain.description;
    orm.isActive = domain.isActive;
    orm.version = domain.version;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;

    if (domain.questions && domain.questions.length > 0) {
      orm.questions = domain.questions.map((q) =>
        QuestionMapper.toOrm(q, domain.id),
      );
    }

    return orm;
  }
}

