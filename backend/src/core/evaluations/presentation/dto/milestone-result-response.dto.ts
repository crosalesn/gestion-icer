import { ApiProperty } from '@nestjs/swagger';
import { MilestoneResult } from '../../domain/entities/milestone-result.entity';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { RiskLevel } from '../../../collaborators/domain/value-objects/risk-level.enum';

export class MilestoneResultResponseDto {
  @ApiProperty()
  id: number | null;

  @ApiProperty()
  collaboratorId: number;

  @ApiProperty({ enum: EvaluationMilestone })
  milestone: EvaluationMilestone;

  @ApiProperty({ required: false, nullable: true })
  collaboratorAssignmentId: number | null;

  @ApiProperty({ required: false, nullable: true })
  teamLeaderAssignmentId: number | null;

  @ApiProperty()
  finalScore: number;

  @ApiProperty({ enum: RiskLevel })
  riskLevel: RiskLevel;

  @ApiProperty()
  calculatedAt: Date;

  @ApiProperty()
  calculationFormula: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromDomain(result: MilestoneResult): MilestoneResultResponseDto {
    const dto = new MilestoneResultResponseDto();
    dto.id = result.id;
    dto.collaboratorId = result.collaboratorId;
    dto.milestone = result.milestone;
    dto.collaboratorAssignmentId = result.collaboratorAssignmentId;
    dto.teamLeaderAssignmentId = result.teamLeaderAssignmentId;
    dto.finalScore = result.finalScore;
    dto.riskLevel = result.riskLevel;
    dto.calculatedAt = result.calculatedAt;
    dto.calculationFormula = result.calculationFormula;
    dto.createdAt = result.createdAt;
    dto.updatedAt = result.updatedAt;
    return dto;
  }
}
