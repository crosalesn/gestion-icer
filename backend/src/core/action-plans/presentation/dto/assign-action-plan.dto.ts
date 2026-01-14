import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ActionPlanType } from '../../domain/value-objects/action-plan-type.enum';
import { AssignActionPlanCommand } from '../../application/commands/assign-action-plan.command';

export class AssignActionPlanDto {
  @IsEnum(ActionPlanType)
  @IsNotEmpty()
  type: ActionPlanType;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  goals: string[];

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  toCommand(collaboratorId: number): AssignActionPlanCommand {
    return new AssignActionPlanCommand(
      collaboratorId,
      this.type,
      this.description,
      this.goals,
      new Date(this.dueDate),
    );
  }
}
