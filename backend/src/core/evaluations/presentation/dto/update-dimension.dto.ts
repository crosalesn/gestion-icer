import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateDimensionCommand } from '../../application/commands/update-dimension.command';

export class UpdateDimensionDto {
  @ApiProperty({
    description: 'Código único de la dimensión',
    example: 'INTEGRATION',
    maxLength: 50,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  code?: string;

  @ApiProperty({
    description: 'Nombre de la dimensión',
    example: 'Integración',
    maxLength: 100,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

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
    required: false,
  })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({
    description: 'Si la dimensión está activa',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  toCommand(id: string): UpdateDimensionCommand {
    return new UpdateDimensionCommand(
      id,
      this.code,
      this.name,
      this.description !== undefined ? this.description : undefined,
      this.order,
      this.isActive,
    );
  }
}

