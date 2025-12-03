import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateCollaboratorUseCase } from '../../application/use-cases/create-collaborator.use-case';
import { FindAllCollaboratorsUseCase } from '../../application/use-cases/find-all-collaborators.use-case';
import { FindCollaboratorByIdUseCase } from '../../application/use-cases/find-collaborator-by-id.use-case';
import { UpdateCollaboratorUseCase } from '../../application/use-cases/update-collaborator.use-case';
import { DeleteCollaboratorUseCase } from '../../application/use-cases/delete-collaborator.use-case';
import { CreateCollaboratorDto } from '../dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from '../dto/update-collaborator.dto';
import { DeleteCollaboratorCommand } from '../../application/commands/delete-collaborator.command';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Controller('collaborators')
@UseGuards(JwtAuthGuard) // Protected endpoints
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
      admissionDate: result.admissionDate instanceof Date ? result.admissionDate.toISOString() : String(result.admissionDate),
      project: String(result.project),
      role: String(result.role),
      teamLeader: String(result.teamLeader),
      status: String(result.status),
      riskLevel: String(result.riskLevel),
      createdAt: result.createdAt instanceof Date ? result.createdAt.toISOString() : String(result.createdAt),
      updatedAt: result.updatedAt instanceof Date ? result.updatedAt.toISOString() : String(result.updatedAt),
    };
  }

  @Get()
  async findAll() {
    const result = await this.findAllCollaboratorsUseCase.execute();
    
    return result.map(c => ({
      id: String(c.id),
      name: String(c.name),
      email: String(c.email),
      admissionDate: c.admissionDate instanceof Date ? c.admissionDate.toISOString() : String(c.admissionDate),
      project: String(c.project),
      role: String(c.role),
      teamLeader: String(c.teamLeader),
      status: String(c.status),
      riskLevel: String(c.riskLevel || 'NONE'),
      createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : String(c.createdAt),
      updatedAt: c.updatedAt instanceof Date ? c.updatedAt.toISOString() : String(c.updatedAt),
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.findCollaboratorByIdUseCase.execute(id);
    return {
      id: String(result.id),
      name: String(result.name),
      email: String(result.email),
      admissionDate: result.admissionDate instanceof Date ? result.admissionDate.toISOString() : String(result.admissionDate),
      project: String(result.project),
      role: String(result.role),
      teamLeader: String(result.teamLeader),
      status: String(result.status),
      riskLevel: String(result.riskLevel || 'NONE'),
      createdAt: result.createdAt instanceof Date ? result.createdAt.toISOString() : String(result.createdAt),
      updatedAt: result.updatedAt instanceof Date ? result.updatedAt.toISOString() : String(result.updatedAt),
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCollaboratorDto) {
    const result = await this.updateCollaboratorUseCase.execute(dto.toCommand(id));
    return {
      id: String(result.id),
      name: String(result.name),
      email: String(result.email),
      admissionDate: result.admissionDate instanceof Date ? result.admissionDate.toISOString() : String(result.admissionDate),
      project: String(result.project),
      role: String(result.role),
      teamLeader: String(result.teamLeader),
      status: String(result.status),
      riskLevel: String(result.riskLevel),
      createdAt: result.createdAt instanceof Date ? result.createdAt.toISOString() : String(result.createdAt),
      updatedAt: result.updatedAt instanceof Date ? result.updatedAt.toISOString() : String(result.updatedAt),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const command = new DeleteCollaboratorCommand(id);
    await this.deleteCollaboratorUseCase.execute(command);
  }
}
