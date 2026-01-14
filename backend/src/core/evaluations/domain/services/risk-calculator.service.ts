import { RiskLevel } from '../../../collaborators/domain/value-objects/risk-level.enum';

export class RiskCalculatorService {
  static calculateRiskFromScore(score: number): RiskLevel {
    if (score >= 1.0 && score <= 1.9) return RiskLevel.HIGH;
    if (score >= 2.0 && score <= 2.9) return RiskLevel.MEDIUM;
    if (score >= 3.0 && score <= 4.0) return RiskLevel.LOW;
    return RiskLevel.NONE;
  }
}
