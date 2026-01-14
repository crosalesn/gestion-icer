import { EvaluationMilestone } from '../../value-objects/evaluation-milestone.enum';
import { TargetRole } from '../../value-objects/target-role.enum';
import {
  ICalculationStrategy,
  CalculationResult,
  AssignmentWithRole,
} from './calculation-strategy.interface';

export class Week1CalculationStrategy implements ICalculationStrategy {
  readonly milestone = EvaluationMilestone.WEEK_1;

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
      throw new Error(
        'Cannot calculate Week 1 result: missing required scored evaluations',
      );
    }

    const collaboratorAssignment = assignments.find(
      (a) => a.role === TargetRole.COLLABORATOR,
    )!;
    const teamLeaderAssignment = assignments.find(
      (a) => a.role === TargetRole.TEAM_LEADER,
    )!;

    const colScore = collaboratorAssignment.assignment.score!;
    const tlScore = teamLeaderAssignment.assignment.score!;

    // Formula: (ICER Col * 0.6) + (ICER TL * 0.4)
    const finalScore = colScore * 0.6 + tlScore * 0.4;
    const formula = `(${colScore.toFixed(1)} * 0.6) + (${tlScore.toFixed(1)} * 0.4) = ${finalScore.toFixed(2)}`;

    return {
      finalScore: Math.round(finalScore * 10) / 10, // Round to 1 decimal
      calculationFormula: formula,
    };
  }
}
