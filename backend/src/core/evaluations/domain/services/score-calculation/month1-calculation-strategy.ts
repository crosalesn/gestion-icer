import { EvaluationMilestone } from '../../value-objects/evaluation-milestone.enum';
import { EvaluationAssignment } from '../../entities/evaluation-assignment.entity';
import {
  ICalculationStrategy,
  CalculationResult,
} from './calculation-strategy.interface';

export class Month1CalculationStrategy implements ICalculationStrategy {
  readonly milestone = EvaluationMilestone.MONTH_1;

  canCalculate(assignments: EvaluationAssignment[]): boolean {
    // Simplified: Only need ONE assignment for Month 1
    const assignment = assignments.find(
      (a) => a.milestone === EvaluationMilestone.MONTH_1 && a.score !== null
    );
    return assignment !== undefined;
  }

  calculate(assignments: EvaluationAssignment[]): CalculationResult {
    if (!this.canCalculate(assignments)) {
      throw new Error('Cannot calculate Month 1 result: missing evaluation');
    }

    const assignment = assignments.find(
      (a) => a.milestone === EvaluationMilestone.MONTH_1 && a.score !== null
    );

    if (!assignment || assignment.score === null) {
      throw new Error('Assignment not found or score is null');
    }

    // Simplified formula: Direct average (no weighting needed with single evaluation)
    const finalScore = assignment.score;
    const formula = `Average(Evaluación) = ${finalScore.toFixed(2)}`;

    return {
      finalScore: Math.round(finalScore * 10) / 10, // Round to 1 decimal
      calculationFormula: formula,
    };
  }
}

