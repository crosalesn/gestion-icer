import { Question } from '../../domain/entities/question.entity';
import { QuestionOrmEntity } from './question.orm-entity';

export class QuestionMapper {
  static toDomain(orm: QuestionOrmEntity): Question {
    return Question.reconstitute(
      orm.id,
      orm.text,
      orm.dimension,
      orm.type,
      orm.order,
      orm.required,
    );
  }

  static toOrm(domain: Question, templateId: string): QuestionOrmEntity {
    const orm = new QuestionOrmEntity();
    orm.id = domain.id;
    orm.templateId = templateId;
    orm.text = domain.text;
    orm.dimension = domain.dimension;
    orm.type = domain.type;
    orm.order = domain.order;
    orm.required = domain.required;
    return orm;
  }
}

