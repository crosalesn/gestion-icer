import { QuestionType } from '../../domain/value-objects/question-type.enum';

export interface UpdateQuestionData {
  id?: string;
  text: string;
  dimensionId: string;
  type: QuestionType;
  order: number;
  required: boolean;
}

export class UpdateTemplateCommand {
  constructor(
    public readonly templateId: number,
    public readonly title?: string,
    public readonly description?: string | null,
    public readonly questions?: UpdateQuestionData[],
    public readonly isActive?: boolean,
    public readonly createNewVersion?: boolean,
  ) {}
}
