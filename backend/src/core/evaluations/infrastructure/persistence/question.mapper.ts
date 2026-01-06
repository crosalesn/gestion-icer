import { Question } from '../../domain/entities/question.entity';
import { QuestionOrmEntity } from './question.orm-entity';
import { DimensionMapper } from './dimension.mapper';

export class QuestionMapper {
  static toDomain(orm: QuestionOrmEntity): Question {
    const dimension = orm.dimension
      ? DimensionMapper.toDomain(orm.dimension)
      : undefined;

    return Question.reconstitute(
      String(orm.id),
      orm.text,
      String(orm.dimensionId),
      orm.type,
      orm.order,
      orm.required,
      dimension,
    );
  }

  static toOrm(domain: Question, templateId: string): QuestionOrmEntity {
    const orm = new QuestionOrmEntity();
    // Only set ID if it's a valid number (for existing entities)
    const numericId = Number(domain.id);
    if (!isNaN(numericId) && numericId > 0) {
      orm.id = numericId;
    }
    
    // Only set templateId if it's provided and valid
    // If templateId is empty, TypeORM will handle it automatically via cascade relationship
    if (templateId && templateId !== '') {
      const numericTemplateId = Number(templateId);
      if (isNaN(numericTemplateId) || numericTemplateId <= 0) {
        throw new Error(`Invalid templateId: ${templateId}. Cannot map question to ORM without valid template ID.`);
      }
      orm.templateId = numericTemplateId;
    }
    
    orm.text = domain.text;
    orm.dimensionId = Number(domain.dimensionId);
    orm.type = domain.type;
    orm.order = domain.order;
    orm.required = domain.required;
    return orm;
  }
}
