import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { RiskLevel } from '../../../collaborators/domain/value-objects/risk-level.enum';

export class CreateFollowUpPlanTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(RiskLevel)
  targetRiskLevel: RiskLevel;

  @IsInt()
  @Min(1)
  durationDays: number;

  @IsInt()
  @Min(1)
  meetingFrequencyDays: number;

  @IsInt()
  @Min(1)
  meetingCount: number;

  @IsString()
  @IsOptional()
  description?: string;
}

