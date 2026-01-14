import { EvaluationMilestone } from '../value-objects/evaluation-milestone.enum';
import { EvaluationStatus } from '../value-objects/evaluation-status.enum';

export interface EvaluationAnswer {
  questionId: string;
  value: number | string;
}

export class EvaluationAssignment {
  constructor(
    private _id: number | null, // null for new entities, assigned by DB after save
    private readonly _collaboratorId: number,
    private readonly _evaluatorUserId: number | null,
    private readonly _templateId: number,
    private readonly _milestone: EvaluationMilestone,
    private _status: EvaluationStatus,
    private readonly _dueDate: Date,
    private _completedAt: Date | null,
    private _answers: EvaluationAnswer[],
    private _score: number | null,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  get id(): number | null {
    return this._id;
  }

  get collaboratorId(): number {
    return this._collaboratorId;
  }

  get evaluatorUserId(): number | null {
    return this._evaluatorUserId;
  }

  get templateId(): number {
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

  // Factory method (id will be assigned by DB)
  static create(
    collaboratorId: number,
    templateId: number,
    milestone: EvaluationMilestone,
    dueDate: Date,
    evaluatorUserId: number | null = null,
  ): EvaluationAssignment {
    const now = new Date();
    return new EvaluationAssignment(
      null, // id is null for new entities
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
    id: number,
    collaboratorId: number,
    evaluatorUserId: number | null,
    templateId: number,
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
