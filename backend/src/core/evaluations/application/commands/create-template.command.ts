import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { TargetRole } from '../../domain/value-objects/target-role.enum';
import { QuestionType } from '../../domain/value-objects/question-type.enum';

export interface CreateQuestionData {
  text: string;
  dimensionId: string;
  type: QuestionType;
  order: number;
  required: boolean;
}

export class CreateTemplateCommand {
  constructor(
    public readonly milestone: EvaluationMilestone,
    public readonly targetRole: TargetRole,
    public readonly title: string,
    public readonly description: string | null,
    public readonly questions: CreateQuestionData[],
  ) {}
}
