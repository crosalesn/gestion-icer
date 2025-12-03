import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CreateCollaboratorCommand } from '../../application/commands/create-collaborator.command';

export class CreateCollaboratorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDateString()
  @IsNotEmpty()
  admissionDate: string;

  @IsString()
  @IsNotEmpty()
  project: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  teamLeader: string;

  toCommand(): CreateCollaboratorCommand {
    return new CreateCollaboratorCommand(
      this.name,
      this.email,
      new Date(this.admissionDate),
      this.project,
      this.role,
      this.teamLeader,
    );
  }
}
