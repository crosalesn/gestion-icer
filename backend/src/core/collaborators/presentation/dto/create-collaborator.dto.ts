import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCollaboratorCommand } from '../../application/commands/create-collaborator.command';
import { parseDateOnly } from '../../../../common/utils/date.utils';

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

  @IsNumber()
  @Type(() => Number)
  clientId: number;

  toCommand(): CreateCollaboratorCommand {
    return new CreateCollaboratorCommand(
      this.name,
      this.email,
      parseDateOnly(this.admissionDate),
      this.project,
      this.role,
      this.teamLeader,
      this.clientId,
    );
  }
}
