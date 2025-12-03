import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { TargetRole } from '../../domain/value-objects/target-role.enum';
import { QuestionDimension } from '../../domain/value-objects/question-dimension.enum';
import { QuestionType } from '../../domain/value-objects/question-type.enum';
import { CreateTemplateCommand } from '../../application/commands/create-template.command';

export class CreateQuestionDto {
  @ApiProperty({
    description: 'Texto de la pregunta',
    example: '¿Te sientes integrado al equipo?',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    enum: QuestionDimension,
    description: 'Dimensión ICER de la pregunta',
  })
  @IsEnum(QuestionDimension)
  @IsNotEmpty()
  dimension: QuestionDimension;

  @ApiProperty({
    enum: QuestionType,
    description: 'Tipo de pregunta',
  })
  @IsEnum(QuestionType)
  @IsNotEmpty()
  type: QuestionType;

  @ApiProperty({
    description: 'Orden de la pregunta en el formulario',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  order: number;

  @ApiProperty({
    description: 'Si la pregunta es obligatoria',
    example: true,
  })
  @IsOptional()
  required?: boolean;
}

export class CreateTemplateDto {
  @ApiProperty({
    enum: EvaluationMilestone,
    description: 'Hito de la evaluación',
  })
  @IsEnum(EvaluationMilestone)
  @IsNotEmpty()
  milestone: EvaluationMilestone;

  @ApiProperty({
    enum: TargetRole,
    description: 'Rol objetivo que responderá esta evaluación',
  })
  @IsEnum(TargetRole)
  @IsNotEmpty()
  targetRole: TargetRole;

  @ApiProperty({
    description: 'Título del template',
    example: 'Evaluación ICER - Día 1',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Descripción del template',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string | null;

  @ApiProperty({
    type: [CreateQuestionDto],
    description: 'Lista de preguntas del template',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  @IsNotEmpty()
  questions: CreateQuestionDto[];

  toCommand(): CreateTemplateCommand {
    return new CreateTemplateCommand(
      this.milestone,
      this.targetRole,
      this.title,
      this.description || null,
      this.questions.map((q) => ({
        text: q.text,
        dimension: q.dimension,
        type: q.type,
        order: q.order,
        required: q.required !== undefined ? q.required : true,
      })),
    );
  }
}

