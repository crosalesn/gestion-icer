import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCollaboratorUseCase } from '../../application/use-cases/create-collaborator.use-case';
import { FindAllCollaboratorsUseCase } from '../../application/use-cases/find-all-collaborators.use-case';
import { FindCollaboratorByIdUseCase } from '../../application/use-cases/find-collaborator-by-id.use-case';
import { UpdateCollaboratorUseCase } from '../../application/use-cases/update-collaborator.use-case';
import { DeleteCollaboratorUseCase } from '../../application/use-cases/delete-collaborator.use-case';
import { CreateCollaboratorDto } from '../dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from '../dto/update-collaborator.dto';
import { DeleteCollaboratorCommand } from '../../application/commands/delete-collaborator.command';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { formatDateOnly } from '../../../../common/utils/date.utils';

@ApiTags('Collaborators')
@ApiBearerAuth()
@Controller('collaborators')
@UseGuards(JwtAuthGuard)
export class CollaboratorController {
  constructor(
    private readonly createCollaboratorUseCase: CreateCollaboratorUseCase,
    private readonly findAllCollaboratorsUseCase: FindAllCollaboratorsUseCase,
    private readonly findCollaboratorByIdUseCase: FindCollaboratorByIdUseCase,
    private readonly updateCollaboratorUseCase: UpdateCollaboratorUseCase,
    private readonly deleteCollaboratorUseCase: DeleteCollaboratorUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateCollaboratorDto) {
    const result = await this.createCollaboratorUseCase.execute(
      dto.toCommand(),
    );
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      admissionDate: formatDateOnly(result.admissionDate),
      project: result.project,
      role: result.role,
      teamLeader: result.teamLeader,
      clientId: result.clientId,
      status: result.status,
      riskLevel: result.riskLevel,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  }

  @Get()
  async findAll() {
    const result = await this.findAllCollaboratorsUseCase.execute();

    return result.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      admissionDate: formatDateOnly(c.admissionDate),
      project: c.project,
      role: c.role,
      teamLeader: c.teamLeader,
      clientId: c.clientId,
      status: c.status,
      riskLevel: c.riskLevel || 'NONE',
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.findCollaboratorByIdUseCase.execute(id);
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      admissionDate: formatDateOnly(result.admissionDate),
      project: result.project,
      role: result.role,
      teamLeader: result.teamLeader,
      clientId: result.clientId,
      status: result.status,
      riskLevel: result.riskLevel || 'NONE',
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCollaboratorDto,
  ) {
    const result = await this.updateCollaboratorUseCase.execute(
      dto.toCommand(id),
    );
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      admissionDate: formatDateOnly(result.admissionDate),
      project: result.project,
      role: result.role,
      teamLeader: result.teamLeader,
      clientId: result.clientId,
      status: result.status,
      riskLevel: result.riskLevel,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    const command = new DeleteCollaboratorCommand(id);
    await this.deleteCollaboratorUseCase.execute(command);
  }
}
