import { ApiProperty } from '@nestjs/swagger';
import { EvaluationAssignment } from '../../domain/entities/evaluation-assignment.entity';
import { EvaluationTemplate } from '../../domain/entities/evaluation-template.entity';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { EvaluationStatus } from '../../domain/value-objects/evaluation-status.enum';
import { TemplateResponseDto } from './template-response.dto';

export class EvaluationAssignmentResponseDto {
  @ApiProperty()
  id: number | null;

  @ApiProperty()
  collaboratorId: number;

  @ApiProperty({ required: false, nullable: true })
  evaluatorUserId: number | null;

  @ApiProperty()
  templateId: number;

  @ApiProperty({ enum: EvaluationMilestone })
  milestone: EvaluationMilestone;

  @ApiProperty({ enum: EvaluationStatus })
  status: EvaluationStatus;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty({ required: false, nullable: true })
  completedAt: Date | null;

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  answers: Array<{ questionId: string; value: number | string }>;

  @ApiProperty({ required: false, nullable: true })
  score: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromDomain(
    assignment: EvaluationAssignment,
  ): EvaluationAssignmentResponseDto {
    const dto = new EvaluationAssignmentResponseDto();
    dto.id = assignment.id;
    dto.collaboratorId = assignment.collaboratorId;
    dto.evaluatorUserId = assignment.evaluatorUserId;
    dto.templateId = assignment.templateId;
    dto.milestone = assignment.milestone;
    dto.status = assignment.status;
    dto.dueDate = assignment.dueDate;
    dto.completedAt = assignment.completedAt;
    dto.answers = assignment.answers;
    dto.score = assignment.score;
    dto.createdAt = assignment.createdAt;
    dto.updatedAt = assignment.updatedAt;
    return dto;
  }
}

export class PendingEvaluationResponseDto {
  @ApiProperty({ type: EvaluationAssignmentResponseDto })
  assignment: EvaluationAssignmentResponseDto;

  @ApiProperty({ type: TemplateResponseDto })
  template: TemplateResponseDto;

  @ApiProperty()
  collaboratorName: string;

  @ApiProperty()
  collaboratorProject: string;

  static fromDomain(
    assignment: EvaluationAssignment,
    template: EvaluationTemplate,
    collaboratorName: string,
    collaboratorProject: string,
  ): PendingEvaluationResponseDto {
    const dto = new PendingEvaluationResponseDto();
    dto.assignment = EvaluationAssignmentResponseDto.fromDomain(assignment);
    dto.template = TemplateResponseDto.fromDomain(template);
    dto.collaboratorName = collaboratorName;
    dto.collaboratorProject = collaboratorProject;
    return dto;
  }
}
