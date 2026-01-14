export class Dimension {
  constructor(
    private readonly _id: string,
    private readonly _code: string,
    private readonly _name: string,
    private readonly _description: string | null,
    private readonly _order: number,
    private readonly _isActive: boolean,
  ) {}

  get id(): string {
    return this._id;
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get order(): number {
    return this._order;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  static create(
    id: string,
    code: string,
    name: string,
    description: string | null,
    order: number,
    isActive: boolean = true,
  ): Dimension {
    return new Dimension(id, code, name, description, order, isActive);
  }

  static reconstitute(
    id: string,
    code: string,
    name: string,
    description: string | null,
    order: number,
    isActive: boolean,
  ): Dimension {
    return new Dimension(id, code, name, description, order, isActive);
  }
}
