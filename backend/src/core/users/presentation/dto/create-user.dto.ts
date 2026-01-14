import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../domain/value-objects/user-role.enum';
import { CreateUserCommand } from '../../application/commands/create-user.command';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  toCommand(): CreateUserCommand {
    return new CreateUserCommand(
      this.name,
      this.email,
      this.password,
      this.role,
    );
  }
}
