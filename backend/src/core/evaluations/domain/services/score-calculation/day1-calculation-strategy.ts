import { EvaluationMilestone } from '../../value-objects/evaluation-milestone.enum';
import { TargetRole } from '../../value-objects/target-role.enum';
import { EvaluationAssignment } from '../../entities/evaluation-assignment.entity';
import {
  ICalculationStrategy,
  CalculationResult,
} from './calculation-strategy.interface';

export class Day1CalculationStrategy implements ICalculationStrategy {
  readonly milestone = EvaluationMilestone.DAY_1;

  canCalculate(assignments: EvaluationAssignment[]): boolean {
    // Day 1 only needs the collaborator evaluation
    const collaboratorAssignment = assignments.find(
      (a) => a.milestone === EvaluationMilestone.DAY_1,
    );
    return collaboratorAssignment !== undefined && collaboratorAssignment.score !== null;
  }

  calculate(assignments: EvaluationAssignment[]): CalculationResult {
    if (!this.canCalculate(assignments)) {
      throw new Error('Cannot calculate Day 1 result: missing collaborator evaluation');
    }

    const collaboratorAssignment = assignments.find(
      (a) => a.milestone === EvaluationMilestone.DAY_1,
    );

    if (!collaboratorAssignment || collaboratorAssignment.score === null) {
      throw new Error('Collaborator assignment not found or score is null');
    }

    const finalScore = collaboratorAssignment.score;
    const formula = `Average(Colaborador) = ${finalScore.toFixed(2)}`;

    return {
      finalScore: Math.round(finalScore * 10) / 10, // Round to 1 decimal
      calculationFormula: formula,
    };
  }
}

