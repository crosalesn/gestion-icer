export class Client {
  constructor(
    private readonly _id: string,
    private _name: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Factory method
  static create(id: string, name: string): Client {
    if (!name || name.trim().length === 0) {
      throw new Error('Client name cannot be empty');
    }
    return new Client(id, name.trim(), new Date(), new Date());
  }

  // Reconstitute from persistence
  static reconstitute(
    id: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
  ): Client {
    return new Client(id, name, createdAt, updatedAt);
  }

  // Domain logic methods
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Client name cannot be empty');
    }
    this._name = name.trim();
    this._updatedAt = new Date();
  }
}

