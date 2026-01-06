import { IsString, IsEmail, IsDateString, IsNotEmpty } from 'class-validator';
import { UpdateCollaboratorCommand } from '../../application/commands/update-collaborator.command';

export class UpdateCollaboratorDto {
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

  @IsString()
  @IsNotEmpty()
  clientId: string;

  toCommand(id: string): UpdateCollaboratorCommand {
    return new UpdateCollaboratorCommand(
      id,
      this.name,
      this.email,
      new Date(this.admissionDate),
      this.project,
      this.role,
      this.teamLeader,
      this.clientId,
    );
  }
}

