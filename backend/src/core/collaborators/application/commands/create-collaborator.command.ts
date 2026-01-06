export class CreateCollaboratorCommand {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly admissionDate: Date,
    public readonly project: string,
    public readonly role: string,
    public readonly teamLeader: string,
    public readonly clientId: string,
  ) {}
}
