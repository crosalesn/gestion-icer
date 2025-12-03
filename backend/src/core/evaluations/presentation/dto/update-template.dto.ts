import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionDimension } from '../../domain/value-objects/question-dimension.enum';
import { QuestionType } from '../../domain/value-objects/question-type.enum';
import { UpdateTemplateCommand } from '../../application/commands/update-template.command';

export class UpdateQuestionDto {
  @ApiProperty({
    description: 'ID de la pregunta (opcional, si no se proporciona se crea una nueva)',
    required: false,
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'Texto de la pregunta',
  })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({
    enum: QuestionDimension,
    description: 'Dimensión ICER de la pregunta',
  })
  @IsEnum(QuestionDimension)
  @IsOptional()
  dimension?: QuestionDimension;

  @ApiProperty({
    enum: QuestionType,
    description: 'Tipo de pregunta',
  })
  @IsEnum(QuestionType)
  @IsOptional()
  type?: QuestionType;

  @ApiProperty({
    description: 'Orden de la pregunta',
  })
  @IsOptional()
  order?: number;

  @ApiProperty({
    description: 'Si la pregunta es obligatoria',
  })
  @IsOptional()
  required?: boolean;
}

export class UpdateTemplateDto {
  @ApiProperty({
    description: 'Título del template',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Descripción del template',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string | null;

  @ApiProperty({
    type: [UpdateQuestionDto],
    description: 'Lista de preguntas (opcional)',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionDto)
  @IsOptional()
  questions?: UpdateQuestionDto[];

  @ApiProperty({
    description: 'Si el template está activo',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Si debe crearse una nueva versión en lugar de actualizar',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  createNewVersion?: boolean;

  toCommand(templateId: string): UpdateTemplateCommand {
    // Transform questions, filtering out any that don't have all required fields
    const questionData = this.questions
      ?.filter(
        (q) =>
          q.text !== undefined &&
          q.dimension !== undefined &&
          q.type !== undefined &&
          q.order !== undefined &&
          q.required !== undefined,
      )
      .map((q) => ({
        id: q.id,
        text: q.text!,
        dimension: q.dimension!,
        type: q.type!,
        order: q.order!,
        required: q.required!,
      }));

    return new UpdateTemplateCommand(
      templateId,
      this.title,
      this.description,
      questionData,
      this.isActive,
      this.createNewVersion,
    );
  }
}

