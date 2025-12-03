import { EvaluationMilestone } from '../value-objects/evaluation-milestone.enum';
import { RiskLevel } from '../../../collaborators/domain/value-objects/risk-level.enum';

export class MilestoneResult {
  constructor(
    private readonly _id: string,
    private readonly _collaboratorId: string,
    private readonly _milestone: EvaluationMilestone,
    private readonly _collaboratorAssignmentId: string | null,
    private readonly _teamLeaderAssignmentId: string | null,
    private readonly _finalScore: number,
    private readonly _riskLevel: RiskLevel,
    private readonly _calculatedAt: Date,
    private readonly _calculationFormula: string,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }

  get collaboratorId(): string {
    return this._collaboratorId;
  }

  get milestone(): EvaluationMilestone {
    return this._milestone;
  }

  get collaboratorAssignmentId(): string | null {
    return this._collaboratorAssignmentId;
  }

  get teamLeaderAssignmentId(): string | null {
    return this._teamLeaderAssignmentId;
  }

  get finalScore(): number {
    return this._finalScore;
  }

  get riskLevel(): RiskLevel {
    return this._riskLevel;
  }

  get calculatedAt(): Date {
    return this._calculatedAt;
  }

  get calculationFormula(): string {
    return this._calculationFormula;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  static create(
    id: string,
    collaboratorId: string,
    milestone: EvaluationMilestone,
    collaboratorAssignmentId: string | null,
    teamLeaderAssignmentId: string | null,
    finalScore: number,
    riskLevel: RiskLevel,
    calculationFormula: string,
  ): MilestoneResult {
    const now = new Date();
    return new MilestoneResult(
      id,
      collaboratorId,
      milestone,
      collaboratorAssignmentId,
      teamLeaderAssignmentId,
      finalScore,
      riskLevel,
      now,
      calculationFormula,
      now,
      now,
    );
  }

  static reconstitute(
    id: string,
    collaboratorId: string,
    milestone: EvaluationMilestone,
    collaboratorAssignmentId: string | null,
    teamLeaderAssignmentId: string | null,
    finalScore: number,
    riskLevel: RiskLevel,
    calculatedAt: Date,
    calculationFormula: string,
    createdAt: Date,
    updatedAt: Date,
  ): MilestoneResult {
    return new MilestoneResult(
      id,
      collaboratorId,
      milestone,
      collaboratorAssignmentId,
      teamLeaderAssignmentId,
      finalScore,
      riskLevel,
      calculatedAt,
      calculationFormula,
      createdAt,
      updatedAt,
    );
  }
}

