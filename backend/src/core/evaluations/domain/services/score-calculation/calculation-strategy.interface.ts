import { EvaluationMilestone } from '../../value-objects/evaluation-milestone.enum';
import { EvaluationAssignment } from '../../entities/evaluation-assignment.entity';

export interface CalculationResult {
  finalScore: number;
  calculationFormula: string;
}

export interface ICalculationStrategy {
  readonly milestone: EvaluationMilestone;
  calculate(assignments: EvaluationAssignment[]): CalculationResult;
  canCalculate(assignments: EvaluationAssignment[]): boolean;
}

