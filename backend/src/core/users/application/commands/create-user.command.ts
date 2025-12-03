import { UserRole } from '../../domain/value-objects/user-role.enum';

export class CreateUserCommand {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
  ) {}
}

