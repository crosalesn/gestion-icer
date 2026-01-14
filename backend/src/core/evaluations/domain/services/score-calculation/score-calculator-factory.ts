import { EvaluationMilestone } from '../../value-objects/evaluation-milestone.enum';
import { ICalculationStrategy } from './calculation-strategy.interface';
import { Day1CalculationStrategy } from './day1-calculation-strategy';
import { Week1CalculationStrategy } from './week1-calculation-strategy';
import { Month1CalculationStrategy } from './month1-calculation-strategy';

export class ScoreCalculatorFactory {
  static create(milestone: EvaluationMilestone): ICalculationStrategy {
    switch (milestone) {
      case EvaluationMilestone.DAY_1:
        return new Day1CalculationStrategy();
      case EvaluationMilestone.WEEK_1:
        return new Week1CalculationStrategy();
      case EvaluationMilestone.MONTH_1:
        return new Month1CalculationStrategy();
    }
  }
}
