import { EvaluationMilestone } from '../value-objects/evaluation-milestone.enum';
import { EvaluationStatus } from '../value-objects/evaluation-status.enum';

export interface EvaluationAnswer {
  questionId: string;
  value: number | string;
}

export class EvaluationAssignment {
  constructor(
    private readonly _id: string,
    private readonly _collaboratorId: string,
    private readonly _evaluatorUserId: string | null,
    private readonly _templateId: string,
    private readonly _milestone: EvaluationMilestone,
    private _status: EvaluationStatus,
    private readonly _dueDate: Date,
    private _completedAt: Date | null,
    private _answers: EvaluationAnswer[],
    private _score: number | null,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }

  get collaboratorId(): string {
    return this._collaboratorId;
  }

  get evaluatorUserId(): string | null {
    return this._evaluatorUserId;
  }

  get templateId(): string {
    return this._templateId;
  }

  get milestone(): EvaluationMilestone {
    return this._milestone;
  }

  get status(): EvaluationStatus {
    return this._status;
  }

  get dueDate(): Date {
    return this._dueDate;
  }

  get completedAt(): Date | null {
    return this._completedAt;
  }

  get answers(): EvaluationAnswer[] {
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

  static create(
    id: string,
    collaboratorId: string,
    templateId: string,
    milestone: EvaluationMilestone,
    dueDate: Date,
    evaluatorUserId: string | null = null,
  ): EvaluationAssignment {
    const now = new Date();
    return new EvaluationAssignment(
      id,
      collaboratorId,
      evaluatorUserId,
      templateId,
      milestone,
      EvaluationStatus.PENDING,
      dueDate,
      null,
      [],
      null,
      now,
      now,
    );
  }

  static reconstitute(
    id: string,
    collaboratorId: string,
    evaluatorUserId: string | null,
    templateId: string,
    milestone: EvaluationMilestone,
    status: EvaluationStatus,
    dueDate: Date,
    completedAt: Date | null,
    answers: EvaluationAnswer[],
    score: number | null,
    createdAt: Date,
    updatedAt: Date,
  ): EvaluationAssignment {
    return new EvaluationAssignment(
      id,
      collaboratorId,
      evaluatorUserId,
      templateId,
      milestone,
      status,
      dueDate,
      completedAt,
      answers,
      score,
      createdAt,
      updatedAt,
    );
  }

  start(): void {
    if (this._status !== EvaluationStatus.PENDING) {
      throw new Error('Cannot start evaluation that is not pending');
    }
    this._status = EvaluationStatus.IN_PROGRESS;
    this._updatedAt = new Date();
  }

  complete(answers: EvaluationAnswer[], score: number): void {
    if (this._status === EvaluationStatus.COMPLETED) {
      throw new Error('Evaluation is already completed');
    }
    this._answers = answers;
    this._score = score;
    this._status = EvaluationStatus.COMPLETED;
    this._completedAt = new Date();
    this._updatedAt = new Date();
  }
}

