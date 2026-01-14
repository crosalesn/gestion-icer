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
      orm.isActive ?? true,
      dimension,
    );
  }

  static toOrm(domain: Question, templateId: number | null): QuestionOrmEntity {
    const orm = new QuestionOrmEntity();
    // Only set ID if it's a valid number (for existing entities)
    const numericId = Number(domain.id);
    if (!isNaN(numericId) && numericId > 0) {
      orm.id = numericId;
    }

    // Only set templateId if it's provided and valid
    if (templateId !== null && templateId > 0) {
      orm.templateId = templateId;
    }

    orm.text = domain.text;
    orm.dimensionId = Number(domain.dimensionId);
    orm.type = domain.type;
    orm.order = domain.order;
    orm.required = domain.required;
    orm.isActive = domain.isActive;
    return orm;
  }
}
