import { MilestoneResult } from '../../domain/entities/milestone-result.entity';
import { MilestoneResultOrmEntity } from './milestone-result.orm-entity';

export class MilestoneResultMapper {
  static toDomain(orm: MilestoneResultOrmEntity): MilestoneResult {
    return MilestoneResult.reconstitute(
      orm.id,
      orm.collaboratorId,
      orm.milestone,
      orm.collaboratorAssignmentId,
      orm.teamLeaderAssignmentId,
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
    if (domain.id !== null) {
      orm.id = domain.id;
    }
    orm.collaboratorId = domain.collaboratorId;
    orm.milestone = domain.milestone;
    orm.collaboratorAssignmentId = domain.collaboratorAssignmentId;
    orm.teamLeaderAssignmentId = domain.teamLeaderAssignmentId;
    orm.finalScore = domain.finalScore;
    orm.riskLevel = domain.riskLevel;
    orm.calculatedAt = domain.calculatedAt;
    orm.calculationFormula = domain.calculationFormula;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    return orm;
  }
}
