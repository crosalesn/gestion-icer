import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDimensionCommand } from '../../application/commands/create-dimension.command';

export class CreateDimensionDto {
  @ApiProperty({
    description: 'Código único de la dimensión',
    example: 'INTEGRATION',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({
    description: 'Nombre de la dimensión',
    example: 'Integración',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Descripción de la dimensión',
    required: false,
    example: 'Mide el nivel de integración del colaborador con el equipo',
  })
  @IsString()
  @IsOptional()
  description?: string | null;

  @ApiProperty({
    description: 'Orden de visualización de la dimensión',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  order: number;

  @ApiProperty({
    description: 'Si la dimensión está activa',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  toCommand(): CreateDimensionCommand {
    return new CreateDimensionCommand(
      this.code,
      this.name,
      this.description ?? null,
      this.order,
      this.isActive !== undefined ? this.isActive : true,
    );
  }
}

