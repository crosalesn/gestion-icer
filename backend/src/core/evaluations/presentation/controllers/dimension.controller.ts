import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GetAllDimensionsUseCase } from '../../application/use-cases/get-all-dimensions.use-case';
import { GetDimensionByIdUseCase } from '../../application/use-cases/get-dimension-by-id.use-case';
import { CreateDimensionUseCase } from '../../application/use-cases/create-dimension.use-case';
import { UpdateDimensionUseCase } from '../../application/use-cases/update-dimension.use-case';
import { DeleteDimensionUseCase } from '../../application/use-cases/delete-dimension.use-case';
import { DimensionResponseDto } from '../dto/dimension-response.dto';
import { CreateDimensionDto } from '../dto/create-dimension.dto';
import { UpdateDimensionDto } from '../dto/update-dimension.dto';

@ApiTags('Dimensions')
@Controller('dimensions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DimensionController {
  constructor(
    private readonly getAllDimensionsUseCase: GetAllDimensionsUseCase,
    private readonly getDimensionByIdUseCase: GetDimensionByIdUseCase,
    private readonly createDimensionUseCase: CreateDimensionUseCase,
    private readonly updateDimensionUseCase: UpdateDimensionUseCase,
    private readonly deleteDimensionUseCase: DeleteDimensionUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las dimensiones ICER' })
  @ApiResponse({
    status: 200,
    description: 'Lista de dimensiones',
    type: [DimensionResponseDto],
  })
  async getAllDimensions(): Promise<DimensionResponseDto[]> {
    const dimensions = await this.getAllDimensionsUseCase.execute();
    return dimensions.map((d) => DimensionResponseDto.fromDomain(d));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una dimensión ICER por ID' })
  @ApiResponse({
    status: 200,
    description: 'Dimensión encontrada',
    type: DimensionResponseDto,
  })
  async getDimensionById(
    @Param('id') id: string,
  ): Promise<DimensionResponseDto> {
    const dimension = await this.getDimensionByIdUseCase.execute(id);
    return DimensionResponseDto.fromDomain(dimension);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva dimensión ICER' })
  @ApiResponse({
    status: 201,
    description: 'Dimensión creada exitosamente',
    type: DimensionResponseDto,
  })
  async createDimension(
    @Body() dto: CreateDimensionDto,
  ): Promise<DimensionResponseDto> {
    const command = dto.toCommand();
    const dimension = await this.createDimensionUseCase.execute(command);
    return DimensionResponseDto.fromDomain(dimension);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una dimensión ICER' })
  @ApiResponse({
    status: 200,
    description: 'Dimensión actualizada exitosamente',
    type: DimensionResponseDto,
  })
  async updateDimension(
    @Param('id') id: string,
    @Body() dto: UpdateDimensionDto,
  ): Promise<DimensionResponseDto> {
    const command = dto.toCommand(id);
    const dimension = await this.updateDimensionUseCase.execute(command);
    return DimensionResponseDto.fromDomain(dimension);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar (desactivar) una dimensión ICER' })
  @ApiResponse({
    status: 200,
    description: 'Dimensión desactivada exitosamente',
  })
  async deleteDimension(@Param('id') id: string): Promise<{ message: string }> {
    await this.deleteDimensionUseCase.execute(id);
    return { message: 'Dimensión desactivada exitosamente' };
  }
}
