import { EvaluationAnswer } from '../../domain/entities/evaluation-assignment.entity';

export class SubmitAssignmentAnswersCommand {
  constructor(
    public readonly assignmentId: number,
    public readonly answers: EvaluationAnswer[],
  ) {}
}
