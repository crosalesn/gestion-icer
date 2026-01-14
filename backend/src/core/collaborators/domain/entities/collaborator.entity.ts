import { CollaboratorStatus } from '../value-objects/collaborator-status.enum';
import { RiskLevel } from '../value-objects/risk-level.enum';

export class Collaborator {
  constructor(
    private _id: number | null, // null for new entities, assigned by DB after save
    private _name: string,
    private _email: string,
    private _admissionDate: Date,
    private _project: string,
    private _role: string, // Job Title
    private _teamLeader: string, // Name of the TL
    private _clientId: number, // Client ID (required)
    private _status: CollaboratorStatus,
    private _riskLevel: RiskLevel,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  get id(): number | null {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get admissionDate(): Date {
    return this._admissionDate;
  }

  get project(): string {
    return this._project;
  }

  get role(): string {
    return this._role;
  }

  get teamLeader(): string {
    return this._teamLeader;
  }

  get clientId(): number {
    return this._clientId;
  }

  get status(): CollaboratorStatus {
    return this._status;
  }

  get riskLevel(): RiskLevel {
    return this._riskLevel;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Factory method for creating new entities (id will be assigned by DB)
  static create(
    name: string,
    email: string,
    admissionDate: Date,
    project: string,
    role: string,
    teamLeader: string,
    clientId: number,
  ): Collaborator {
    return new Collaborator(
      null, // id is null for new entities
      name,
      email,
      admissionDate,
      project,
      role,
      teamLeader,
      clientId,
      CollaboratorStatus.PENDING_DAY_1,
      RiskLevel.NONE,
      new Date(),
      new Date(),
    );
  }

  // Reconstitute from persistence
  static reconstitute(
    id: number,
    name: string,
    email: string,
    admissionDate: Date,
    project: string,
    role: string,
    teamLeader: string,
    clientId: number,
    status: CollaboratorStatus,
    riskLevel: RiskLevel,
    createdAt: Date,
    updatedAt: Date,
  ): Collaborator {
    return new Collaborator(
      id,
      name,
      email,
      admissionDate,
      project,
      role,
      teamLeader,
      clientId,
      status,
      riskLevel,
      createdAt,
      updatedAt,
    );
  }

  // Domain logic methods
  advanceStatus(): void {
    if (this._status === CollaboratorStatus.PENDING_DAY_1) {
      this._status = CollaboratorStatus.PENDING_WEEK_1;
    } else if (this._status === CollaboratorStatus.PENDING_WEEK_1) {
      this._status = CollaboratorStatus.PENDING_MONTH_1;
    } else if (this._status === CollaboratorStatus.PENDING_MONTH_1) {
      this._status = CollaboratorStatus.FINISHED;
    }
    this._updatedAt = new Date();
  }

  updateRiskLevel(level: RiskLevel): void {
    this._riskLevel = level;
    this._updatedAt = new Date();
  }

  updateClientId(clientId: number): void {
    this._clientId = clientId;
    this._updatedAt = new Date();
  }
}
