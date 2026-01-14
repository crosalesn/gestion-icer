import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { AssignEvaluationUseCase } from '../../application/use-cases/assign-evaluation.use-case';
import { GetPendingEvaluationsUseCase } from '../../application/use-cases/get-pending-evaluations.use-case';
import { SubmitAssignmentAnswersUseCase } from '../../application/use-cases/submit-assignment-answers.use-case';
import { AssignEvaluationCommand } from '../../application/commands/assign-evaluation.command';
import { SubmitAssignmentAnswersCommand } from '../../application/commands/submit-assignment-answers.command';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { CreateTemplateUseCase } from '../../application/use-cases/create-template.use-case';
import { UpdateTemplateUseCase } from '../../application/use-cases/update-template.use-case';
import { GetAllTemplatesUseCase } from '../../application/use-cases/get-all-templates.use-case';
import { GetTemplateByIdUseCase } from '../../application/use-cases/get-template-by-id.use-case';
import { SeedTemplatesUseCase } from '../../application/use-cases/seed-templates.use-case';
import { GetCollaboratorMilestoneResultsUseCase } from '../../application/use-cases/get-collaborator-milestone-results.use-case';
import { GetCollaboratorCompletedAssignmentsUseCase } from '../../application/use-cases/get-collaborator-completed-assignments.use-case';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { UpdateTemplateDto } from '../dto/update-template.dto';
import { TemplateResponseDto } from '../dto/template-response.dto';
import { MilestoneResultResponseDto } from '../dto/milestone-result-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Evaluations')
@ApiBearerAuth()
@Controller('evaluations')
@UseGuards(JwtAuthGuard)
export class EvaluationController {
  constructor(
    private readonly assignEvaluationUseCase: AssignEvaluationUseCase,
    private readonly getPendingEvaluationsUseCase: GetPendingEvaluationsUseCase,
    private readonly submitAssignmentAnswersUseCase: SubmitAssignmentAnswersUseCase,
    private readonly createTemplateUseCase: CreateTemplateUseCase,
    private readonly updateTemplateUseCase: UpdateTemplateUseCase,
    private readonly getAllTemplatesUseCase: GetAllTemplatesUseCase,
    private readonly getTemplateByIdUseCase: GetTemplateByIdUseCase,
    private readonly seedTemplatesUseCase: SeedTemplatesUseCase,
    private readonly getCollaboratorMilestoneResultsUseCase: GetCollaboratorMilestoneResultsUseCase,
    private readonly getCollaboratorCompletedAssignmentsUseCase: GetCollaboratorCompletedAssignmentsUseCase,
  ) {}

  @Get('pending')
  async getAllPending() {
    return this.getPendingEvaluationsUseCase.execute();
  }

  @Post('assign')
  async assign(
    @Body() body: { collaboratorId: number; milestone: EvaluationMilestone },
  ) {
    const command = new AssignEvaluationCommand(
      body.collaboratorId,
      body.milestone,
    );
    return this.assignEvaluationUseCase.execute(command);
  }

  @Post('assignments/:id/submit')
  async submitAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: { answers: Array<{ questionId: string; value: number | string }> },
  ) {
    const command = new SubmitAssignmentAnswersCommand(id, body.answers);
    return this.submitAssignmentAnswersUseCase.execute(command);
  }

  @Get('collaborators/:collaboratorId/results')
  @ApiOperation({
    summary: 'Obtener resultados de evaluaciones de un colaborador',
  })
  @ApiResponse({ status: 200, type: [MilestoneResultResponseDto] })
  async getCollaboratorResults(
    @Param('collaboratorId', ParseIntPipe) collaboratorId: number,
  ) {
    const results =
      await this.getCollaboratorMilestoneResultsUseCase.execute(collaboratorId);
    return results.map((r) => MilestoneResultResponseDto.fromDomain(r));
  }

  @Get('collaborators/:collaboratorId/completed-assignments')
  @ApiOperation({
    summary:
      'Obtener evaluaciones completadas con respuestas de un colaborador',
  })
  @ApiResponse({ status: 200 })
  async getCollaboratorCompletedAssignments(
    @Param('collaboratorId', ParseIntPipe) collaboratorId: number,
  ) {
    return this.getCollaboratorCompletedAssignmentsUseCase.execute(
      collaboratorId,
    );
  }

  // Template Administration Endpoints
  @Get('templates')
  @ApiOperation({ summary: 'Listar todos los templates de evaluación' })
  @ApiResponse({ status: 200, type: [TemplateResponseDto] })
  async getAllTemplates(): Promise<TemplateResponseDto[]> {
    const templates = await this.getAllTemplatesUseCase.execute();
    return templates.map((t) => TemplateResponseDto.fromDomain(t));
  }

  @Post('templates')
  @ApiOperation({ summary: 'Crear un nuevo template de evaluación' })
  @ApiResponse({ status: 201, type: TemplateResponseDto })
  async createTemplate(
    @Body() createTemplateDto: CreateTemplateDto,
  ): Promise<TemplateResponseDto> {
    const command = createTemplateDto.toCommand();
    const template = await this.createTemplateUseCase.execute(command);
    return TemplateResponseDto.fromDomain(template);
  }

  @Post('templates/seed')
  @ApiOperation({
    summary: 'Inicializar templates con preguntas de la ficha ICER',
  })
  @ApiResponse({
    status: 201,
    description: 'Templates inicializados exitosamente',
  })
  async seedTemplates() {
    const result = await this.seedTemplatesUseCase.execute();
    return {
      message: `Seed completado: ${result.created} templates creados, ${result.skipped} omitidos`,
      created: result.created,
      skipped: result.skipped,
      templates: result.templates.map((t) => TemplateResponseDto.fromDomain(t)),
    };
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Obtener un template de evaluación por ID' })
  @ApiResponse({ status: 200, type: TemplateResponseDto })
  async getTemplateById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TemplateResponseDto> {
    const template = await this.getTemplateByIdUseCase.execute(id);
    return TemplateResponseDto.fromDomain(template);
  }

  @Put('templates/:id')
  @ApiOperation({ summary: 'Actualizar un template de evaluación' })
  @ApiResponse({ status: 200, type: TemplateResponseDto })
  async updateTemplate(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ): Promise<TemplateResponseDto> {
    const command = updateTemplateDto.toCommand(id);
    const template = await this.updateTemplateUseCase.execute(command);
    return TemplateResponseDto.fromDomain(template);
  }
}
