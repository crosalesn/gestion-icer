import { EvaluationAssignment } from '../../domain/entities/evaluation-assignment.entity';
import { EvaluationAssignmentOrmEntity } from './evaluation-assignment.orm-entity';

export class EvaluationAssignmentMapper {
  static toDomain(orm: EvaluationAssignmentOrmEntity): EvaluationAssignment {
    return EvaluationAssignment.reconstitute(
      orm.id,
      orm.collaboratorId,
      orm.evaluatorUserId,
      orm.templateId,
      orm.milestone,
      orm.status,
      orm.dueDate,
      orm.completedAt,
      orm.answers || [],
      orm.score,
      orm.createdAt,
      orm.updatedAt,
    );
  }

  static toOrm(domain: EvaluationAssignment): EvaluationAssignmentOrmEntity {
    const orm = new EvaluationAssignmentOrmEntity();
    orm.id = domain.id;
    orm.collaboratorId = domain.collaboratorId;
    orm.evaluatorUserId = domain.evaluatorUserId;
    orm.templateId = domain.templateId;
    orm.milestone = domain.milestone;
    orm.status = domain.status;
    orm.dueDate = domain.dueDate;
    orm.completedAt = domain.completedAt;
    orm.answers = domain.answers;
    orm.score = domain.score;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    return orm;
  }
}

