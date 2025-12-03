import { QuestionDimension } from '../../domain/value-objects/question-dimension.enum';
import { QuestionType } from '../../domain/value-objects/question-type.enum';

export interface UpdateQuestionData {
  id?: string; // If provided, update existing question; if not, create new
  text: string;
  dimension: QuestionDimension;
  type: QuestionType;
  order: number;
  required: boolean;
}

export class UpdateTemplateCommand {
  constructor(
    public readonly templateId: string,
    public readonly title?: string,
    public readonly description?: string | null,
    public readonly questions?: UpdateQuestionData[],
    public readonly isActive?: boolean,
    public readonly createNewVersion?: boolean, // If true, creates new version instead of updating
  ) {}
}

