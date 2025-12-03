import { QuestionDimension } from '../value-objects/question-dimension.enum';
import { QuestionType } from '../value-objects/question-type.enum';

export class Question {
  constructor(
    private readonly _id: string,
    private readonly _text: string,
    private readonly _dimension: QuestionDimension,
    private readonly _type: QuestionType,
    private readonly _order: number,
    private readonly _required: boolean,
  ) {}

  get id(): string {
    return this._id;
  }

  get text(): string {
    return this._text;
  }

  get dimension(): QuestionDimension {
    return this._dimension;
  }

  get type(): QuestionType {
    return this._type;
  }

  get order(): number {
    return this._order;
  }

  get required(): boolean {
    return this._required;
  }

  static create(
    id: string,
    text: string,
    dimension: QuestionDimension,
    type: QuestionType,
    order: number,
    required: boolean,
  ): Question {
    return new Question(id, text, dimension, type, order, required);
  }

  static reconstitute(
    id: string,
    text: string,
    dimension: QuestionDimension,
    type: QuestionType,
    order: number,
    required: boolean,
  ): Question {
    return new Question(id, text, dimension, type, order, required);
  }
}

