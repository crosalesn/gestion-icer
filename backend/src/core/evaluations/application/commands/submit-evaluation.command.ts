export class SubmitEvaluationCommand {
  constructor(
    public readonly evaluationId: string,
    public readonly answers: Record<string, number | string>, // Question ID -> Answer
  ) {}
}

