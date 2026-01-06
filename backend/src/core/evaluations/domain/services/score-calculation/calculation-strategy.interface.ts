import { EvaluationMilestone } from '../../value-objects/evaluation-milestone.enum';
import { EvaluationAssignment } from '../../entities/evaluation-assignment.entity';
import { TargetRole } from '../../value-objects/target-role.enum';

export interface AssignmentWithRole {
  assignment: EvaluationAssignment;
  role: TargetRole;
}

import { RiskLevel } from '../../../../collaborators/domain/value-objects/risk-level.enum';

export interface CalculationResult {
  finalScore: number;
  calculationFormula: string;
  determinedRiskLevel?: RiskLevel;
}

export interface ICalculationStrategy {
  readonly milestone: EvaluationMilestone;
  calculate(assignments: AssignmentWithRole[]): CalculationResult;
  canCalculate(assignments: AssignmentWithRole[]): boolean;
}
