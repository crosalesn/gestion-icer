import { Evaluation } from '../../domain/entities/evaluation.entity';
import { EvaluationOrmEntity } from './evaluation.orm-entity';

export class EvaluationMapper {
  static toDomain(orm: EvaluationOrmEntity): Evaluation {
    return Evaluation.reconstitute(
      orm.id,
      orm.collaboratorId,
      orm.type,
      orm.status,
      orm.answers,
      orm.score,
      orm.createdAt,
      orm.updatedAt,
      orm.completedAt,
    );
  }

  static toOrm(domain: Evaluation): EvaluationOrmEntity {
    const orm = new EvaluationOrmEntity();
    orm.id = domain.id;
    orm.collaboratorId = domain.collaboratorId;
    orm.type = domain.type;
    orm.status = domain.status;
    orm.answers = domain.answers;
    orm.score = domain.score;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    orm.completedAt = domain.completedAt;
    return orm;
  }
}

