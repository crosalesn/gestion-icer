import { EvaluationMilestone } from '../../value-objects/evaluation-milestone.enum';
import { TargetRole } from '../../value-objects/target-role.enum';
import {
  ICalculationStrategy,
  CalculationResult,
  AssignmentWithRole,
} from './calculation-strategy.interface';

export class Day1CalculationStrategy implements ICalculationStrategy {
  readonly milestone = EvaluationMilestone.DAY_1;

  canCalculate(assignments: AssignmentWithRole[]): boolean {
    // Day 1 only needs the collaborator evaluation
    const collaboratorAssignment = assignments.find(
      (a) => a.role === TargetRole.COLLABORATOR,
    );
    return collaboratorAssignment !== undefined && collaboratorAssignment.assignment.score !== null;
  }

  calculate(assignments: AssignmentWithRole[]): CalculationResult {
    if (!this.canCalculate(assignments)) {
      throw new Error('Cannot calculate Day 1 result: missing collaborator evaluation');
    }

    const collaboratorAssignment = assignments.find(
      (a) => a.role === TargetRole.COLLABORATOR,
    )!;

    if (!collaboratorAssignment.assignment.score) {
       throw new Error('Collaborator assignment score is null');
    }

    const finalScore = collaboratorAssignment.assignment.score;
    const formula = `Average(Colaborador) = ${finalScore.toFixed(2)}`;

    return {
      finalScore: Math.round(finalScore * 10) / 10, // Round to 1 decimal
      calculationFormula: formula,
    };
  }
}
