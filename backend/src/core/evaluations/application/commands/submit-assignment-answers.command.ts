import { EvaluationAnswer } from '../../domain/entities/evaluation-assignment.entity';

export class SubmitAssignmentAnswersCommand {
  constructor(
    public readonly assignmentId: string,
    public readonly answers: EvaluationAnswer[],
  ) {}
}

