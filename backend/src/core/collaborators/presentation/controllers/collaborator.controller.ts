import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
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
    const result = await this.createCollaboratorUseCase.execute(dto.toCommand());
    return {
      id: String(result.id),
      name: String(result.name),
      email: String(result.email),
      admissionDate: result.admissionDate.toISOString(),
      project: String(result.project),
      role: String(result.role),
      teamLeader: String(result.teamLeader),
      clientId: result.clientId ? String(result.clientId) : null,
      status: String(result.status),
      riskLevel: String(result.riskLevel),
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  }

  @Get()
  async findAll() {
    const result = await this.findAllCollaboratorsUseCase.execute();
    
    return result.map(c => ({
      id: String(c.id),
      name: String(c.name),
      email: String(c.email),
      admissionDate: c.admissionDate.toISOString(),
      project: String(c.project),
      role: String(c.role),
      teamLeader: String(c.teamLeader),
      clientId: c.clientId ? String(c.clientId) : null,
      status: String(c.status),
      riskLevel: String(c.riskLevel || 'NONE'),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.findCollaboratorByIdUseCase.execute(id);
    return {
      id: String(result.id),
      name: String(result.name),
      email: String(result.email),
      admissionDate: result.admissionDate.toISOString(),
      project: String(result.project),
      role: String(result.role),
      teamLeader: String(result.teamLeader),
      clientId: result.clientId ? String(result.clientId) : null,
      status: String(result.status),
      riskLevel: String(result.riskLevel || 'NONE'),
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCollaboratorDto) {
    const result = await this.updateCollaboratorUseCase.execute(dto.toCommand(id));
    return {
      id: String(result.id),
      name: String(result.name),
      email: String(result.email),
      admissionDate: result.admissionDate.toISOString(),
      project: String(result.project),
      role: String(result.role),
      teamLeader: String(result.teamLeader),
      clientId: result.clientId ? String(result.clientId) : null,
      status: String(result.status),
      riskLevel: String(result.riskLevel),
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const command = new DeleteCollaboratorCommand(id);
    await this.deleteCollaboratorUseCase.execute(command);
  }
}
