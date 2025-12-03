import { EvaluationType } from '../value-objects/evaluation-type.enum';
import { EvaluationStatus } from '../value-objects/evaluation-status.enum';

export class Evaluation {
  constructor(
    private readonly _id: string,
    private readonly _collaboratorId: string,
    private readonly _type: EvaluationType,
    private _status: EvaluationStatus,
    private _answers: Record<string, number | string>, // Key: Question ID, Value: Score or Text
    private _score: number | null, // Calculated score for this specific evaluation
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _completedAt: Date | null,
  ) {}

  get id(): string {
    return this._id;
  }

  get collaboratorId(): string {
    return this._collaboratorId;
  }

  get type(): EvaluationType {
    return this._type;
  }

  get status(): EvaluationStatus {
    return this._status;
  }

  get answers(): Record<string, number | string> {
    return this._answers;
  }

  get score(): number | null {
    return this._score;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get completedAt(): Date | null {
    return this._completedAt;
  }

  // Factory method
  static create(
    id: string,
    collaboratorId: string,
    type: EvaluationType,
  ): Evaluation {
    return new Evaluation(
      id,
      collaboratorId,
      type,
      EvaluationStatus.PENDING,
      {},
      null,
      new Date(),
      new Date(),
      null,
    );
  }

  // Reconstitute
  static reconstitute(
    id: string,
    collaboratorId: string,
    type: EvaluationType,
    status: EvaluationStatus,
    answers: Record<string, number | string>,
    score: number | null,
    createdAt: Date,
    updatedAt: Date,
    completedAt: Date | null,
  ): Evaluation {
    return new Evaluation(
      id,
      collaboratorId,
      type,
      status,
      answers,
      score,
      createdAt,
      updatedAt,
      completedAt,
    );
  }

  complete(answers: Record<string, number | string>, score: number): void {
    this._answers = answers;
    this._score = score;
    this._status = EvaluationStatus.COMPLETED;
    this._completedAt = new Date();
    this._updatedAt = new Date();
  }
}

