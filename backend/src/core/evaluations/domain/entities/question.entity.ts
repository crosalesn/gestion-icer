import { QuestionType } from '../value-objects/question-type.enum';
import { Dimension } from './dimension.entity';

export class Question {
  constructor(
    private readonly _id: string,
    private readonly _text: string,
    private readonly _dimensionId: string,
    private readonly _type: QuestionType,
    private readonly _order: number,
    private readonly _required: boolean,
    private readonly _isActive: boolean = true,
    private readonly _dimension?: Dimension,
  ) {}

  get id(): string {
    return this._id;
  }

  get text(): string {
    return this._text;
  }

  get dimensionId(): string {
    return this._dimensionId;
  }

  get dimension(): Dimension | undefined {
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

  get isActive(): boolean {
    return this._isActive;
  }

  static create(
    text: string,
    dimensionId: string,
    type: QuestionType,
    order: number,
    required: boolean,
  ): Question {
    return new Question('', text, dimensionId, type, order, required, true);
  }

  static reconstitute(
    id: string,
    text: string,
    dimensionId: string,
    type: QuestionType,
    order: number,
    required: boolean,
    isActive: boolean = true,
    dimension?: Dimension,
  ): Question {
    return new Question(
      id,
      text,
      dimensionId,
      type,
      order,
      required,
      isActive,
      dimension,
    );
  }
}
