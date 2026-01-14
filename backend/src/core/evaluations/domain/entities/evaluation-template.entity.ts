import { EvaluationMilestone } from '../value-objects/evaluation-milestone.enum';
import { TargetRole } from '../value-objects/target-role.enum';
import { Question } from './question.entity';

export class EvaluationTemplate {
  constructor(
    private _id: number | null,
    private readonly _milestone: EvaluationMilestone,
    private readonly _targetRole: TargetRole,
    private readonly _title: string,
    private readonly _description: string | null,
    private readonly _questions: Question[],
    private readonly _isActive: boolean,
    private readonly _version: number,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {}

  get id(): number | null {
    return this._id;
  }

  get milestone(): EvaluationMilestone {
    return this._milestone;
  }

  get targetRole(): TargetRole {
    return this._targetRole;
  }

  get title(): string {
    return this._title;
  }

  get description(): string | null {
    return this._description;
  }

  get questions(): Question[] {
    return this._questions;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get version(): number {
    return this._version;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  static create(
    milestone: EvaluationMilestone,
    targetRole: TargetRole,
    title: string,
    description: string | null,
    questions: Question[],
    version: number = 1,
  ): EvaluationTemplate {
    const now = new Date();
    return new EvaluationTemplate(
      null,
      milestone,
      targetRole,
      title,
      description,
      questions,
      true,
      version,
      now,
      now,
    );
  }

  static reconstitute(
    id: number,
    milestone: EvaluationMilestone,
    targetRole: TargetRole,
    title: string,
    description: string | null,
    questions: Question[],
    isActive: boolean,
    version: number,
    createdAt: Date,
    updatedAt: Date,
  ): EvaluationTemplate {
    return new EvaluationTemplate(
      id,
      milestone,
      targetRole,
      title,
      description,
      questions,
      isActive,
      version,
      createdAt,
      updatedAt,
    );
  }
}
