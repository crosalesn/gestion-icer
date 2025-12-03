import { Collaborator } from '../../domain/entities/collaborator.entity';
import { CollaboratorOrmEntity } from './collaborator.orm-entity';

export class CollaboratorMapper {
  static toDomain(orm: CollaboratorOrmEntity): Collaborator {
    return Collaborator.reconstitute(
      orm.id,
      orm.name,
      orm.email,
      orm.admissionDate,
      orm.project,
      orm.role,
      orm.teamLeader,
      orm.status,
      orm.riskLevel,
      orm.createdAt,
      orm.updatedAt,
    );
  }

  static toOrm(domain: Collaborator): CollaboratorOrmEntity {
    const orm = new CollaboratorOrmEntity();
    orm.id = domain.id;
    orm.name = domain.name;
    orm.email = domain.email;
    orm.admissionDate = domain.admissionDate;
    orm.project = domain.project;
    orm.role = domain.role;
    orm.teamLeader = domain.teamLeader;
    orm.status = domain.status;
    orm.riskLevel = domain.riskLevel;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    return orm;
  }
}
