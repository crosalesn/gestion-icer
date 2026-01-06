import { MilestoneResult } from '../../domain/entities/milestone-result.entity';
import { MilestoneResultOrmEntity } from './milestone-result.orm-entity';

export class MilestoneResultMapper {
  static toDomain(orm: MilestoneResultOrmEntity): MilestoneResult {
    return MilestoneResult.reconstitute(
      String(orm.id),
      String(orm.collaboratorId),
      orm.milestone,
      orm.collaboratorAssignmentId ? String(orm.collaboratorAssignmentId) : null,
      orm.teamLeaderAssignmentId ? String(orm.teamLeaderAssignmentId) : null,
      orm.finalScore,
      orm.riskLevel,
      orm.calculatedAt,
      orm.calculationFormula,
      orm.createdAt,
      orm.updatedAt,
    );
  }

  static toOrm(domain: MilestoneResult): MilestoneResultOrmEntity {
    const orm = new MilestoneResultOrmEntity();
    if (domain.id) {
      orm.id = Number(domain.id);
    }
    orm.collaboratorId = Number(domain.collaboratorId);
    orm.milestone = domain.milestone;
    orm.collaboratorAssignmentId = domain.collaboratorAssignmentId
      ? Number(domain.collaboratorAssignmentId)
      : null;
    orm.teamLeaderAssignmentId = domain.teamLeaderAssignmentId
      ? Number(domain.teamLeaderAssignmentId)
      : null;
    orm.finalScore = domain.finalScore;
    orm.riskLevel = domain.riskLevel;
    orm.calculatedAt = domain.calculatedAt;
    orm.calculationFormula = domain.calculationFormula;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    return orm;
  }
}

