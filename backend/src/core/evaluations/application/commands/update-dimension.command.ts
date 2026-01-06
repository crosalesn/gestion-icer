export class UpdateDimensionCommand {
  constructor(
    public readonly id: string,
    public readonly code?: string,
    public readonly name?: string,
    public readonly description?: string | null,
    public readonly order?: number,
    public readonly isActive?: boolean,
  ) {}
}

