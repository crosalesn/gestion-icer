import { EvaluationMilestone } from '../../value-objects/evaluation-milestone.enum';
import { TargetRole } from '../../value-objects/target-role.enum';
import { RiskLevel } from '../../../../collaborators/domain/value-objects/risk-level.enum';
import {
  ICalculationStrategy,
  CalculationResult,
  AssignmentWithRole,
} from './calculation-strategy.interface';

export class Month1CalculationStrategy implements ICalculationStrategy {
  readonly milestone = EvaluationMilestone.MONTH_1;

  canCalculate(assignments: AssignmentWithRole[]): boolean {
    // We need both Collaborator and Team Leader assignments to be scored
    const collaboratorAssignment = assignments.find(
      (a) => a.role === TargetRole.COLLABORATOR,
    );
    const teamLeaderAssignment = assignments.find(
      (a) => a.role === TargetRole.TEAM_LEADER,
    );

    return (
      collaboratorAssignment !== undefined &&
      collaboratorAssignment.assignment.score !== null &&
      teamLeaderAssignment !== undefined &&
      teamLeaderAssignment.assignment.score !== null
    );
  }

  calculate(assignments: AssignmentWithRole[]): CalculationResult {
    if (!this.canCalculate(assignments)) {
      throw new Error('Cannot calculate Month 1 result: missing required scored evaluations');
    }

    const collaboratorAssignment = assignments.find(
      (a) => a.role === TargetRole.COLLABORATOR,
    )!;
    const teamLeaderAssignment = assignments.find(
      (a) => a.role === TargetRole.TEAM_LEADER,
    )!;

    const colScore = collaboratorAssignment.assignment.score!;
    const tlScore = teamLeaderAssignment.assignment.score!;

    // Formula: (ICER Col * 0.4) + (ICER TL * 0.6)
    const finalScoreRaw = colScore * 0.4 + tlScore * 0.6;
    const finalScore = Math.round(finalScoreRaw * 10) / 10; // Round to 1 decimal
    const formula = `(${colScore.toFixed(1)} * 0.4) + (${tlScore.toFixed(1)} * 0.6) = ${finalScore.toFixed(2)}`;

    // Determine Risk Level based on final score
    let riskLevel = RiskLevel.NONE;
    if (finalScore >= 1.0 && finalScore <= 1.9) {
      riskLevel = RiskLevel.HIGH;
    } else if (finalScore >= 2.0 && finalScore <= 2.9) {
      riskLevel = RiskLevel.MEDIUM;
    } else if (finalScore >= 3.0) {
      riskLevel = RiskLevel.LOW;
    }

    return {
      finalScore: finalScore,
      calculationFormula: formula,
      determinedRiskLevel: riskLevel, // New field in CalculationResult
    };
  }
}
