import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';

export class AssignEvaluationCommand {
  constructor(
    public readonly collaboratorId: number,
    public readonly milestone: EvaluationMilestone,
  ) {}
}
