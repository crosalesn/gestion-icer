import { ApiProperty } from '@nestjs/swagger';
import { Dimension } from '../../domain/entities/dimension.entity';

export class DimensionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description: string | null;

  @ApiProperty()
  order: number;

  @ApiProperty()
  isActive: boolean;

  static fromDomain(dimension: Dimension): DimensionResponseDto {
    const dto = new DimensionResponseDto();
    dto.id = dimension.id;
    dto.code = dimension.code;
    dto.name = dimension.name;
    dto.description = dimension.description;
    dto.order = dimension.order;
    dto.isActive = dimension.isActive;
    return dto;
  }
}
