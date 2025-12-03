import { ApiProperty } from '@nestjs/swagger';
import { EvaluationTemplate } from '../../domain/entities/evaluation-template.entity';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { TargetRole } from '../../domain/value-objects/target-role.enum';
import { QuestionDimension } from '../../domain/value-objects/question-dimension.enum';
import { QuestionType } from '../../domain/value-objects/question-type.enum';

export class QuestionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  text: string;

  @ApiProperty({ enum: QuestionDimension })
  dimension: QuestionDimension;

  @ApiProperty({ enum: QuestionType })
  type: QuestionType;

  @ApiProperty()
  order: number;

  @ApiProperty()
  required: boolean;
}

export class TemplateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: EvaluationMilestone })
  milestone: EvaluationMilestone;

  @ApiProperty({ enum: TargetRole })
  targetRole: TargetRole;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description: string | null;

  @ApiProperty({ type: [QuestionResponseDto] })
  questions: QuestionResponseDto[];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  version: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromDomain(template: EvaluationTemplate): TemplateResponseDto {
    const dto = new TemplateResponseDto();
    dto.id = template.id;
    dto.milestone = template.milestone;
    dto.targetRole = template.targetRole;
    dto.title = template.title;
    dto.description = template.description;
    dto.questions = template.questions.map((q) => {
      const questionDto = new QuestionResponseDto();
      questionDto.id = q.id;
      questionDto.text = q.text;
      questionDto.dimension = q.dimension;
      questionDto.type = q.type;
      questionDto.order = q.order;
      questionDto.required = q.required;
      return questionDto;
    });
    dto.isActive = template.isActive;
    dto.version = template.version;
    dto.createdAt = template.createdAt;
    dto.updatedAt = template.updatedAt;
    return dto;
  }
}

