import { UserRole } from '../value-objects/user-role.enum';

export class User {
  constructor(
    private readonly _id: string,
    private _name: string,
    private _email: string,
    private _passwordHash: string,
    private _role: UserRole,
    private _isActive: boolean,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get role(): UserRole {
    return this._role;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Factory method for creating a new user
  static create(
    id: string,
    name: string,
    email: string,
    passwordHash: string,
    role: UserRole,
  ): User {
    return new User(
      id,
      name,
      email,
      passwordHash,
      role,
      true,
      new Date(),
      new Date(),
    );
  }

  // Method to reconstruct user from persistence
  static reconstitute(
    id: string,
    name: string,
    email: string,
    passwordHash: string,
    role: UserRole,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(
      id,
      name,
      email,
      passwordHash,
      role,
      isActive,
      createdAt,
      updatedAt,
    );
  }
}

