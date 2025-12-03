import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AssignActionPlanUseCase } from '../../application/use-cases/assign-action-plan.use-case';
import { GetCollaboratorActionPlansUseCase } from '../../application/use-cases/get-collaborator-action-plans.use-case';
import { AssignActionPlanDto } from '../dto/assign-action-plan.dto';
import { ActionPlan } from '../../domain/entities/action-plan.entity';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Controller('action-plans')
@UseGuards(JwtAuthGuard)
export class ActionPlanController {
  constructor(
    private readonly assignActionPlanUseCase: AssignActionPlanUseCase,
    private readonly getCollaboratorActionPlansUseCase: GetCollaboratorActionPlansUseCase,
  ) {}

  @Post('collaborator/:collaboratorId')
  async assign(
    @Param('collaboratorId') collaboratorId: string,
    @Body() dto: AssignActionPlanDto,
  ): Promise<ActionPlan> {
    return this.assignActionPlanUseCase.execute(
      dto.toCommand(collaboratorId),
    );
  }

  @Get('collaborator/:collaboratorId')
  async getByCollaborator(
    @Param('collaboratorId') collaboratorId: string,
  ): Promise<ActionPlan[]> {
    return this.getCollaboratorActionPlansUseCase.execute(collaboratorId);
  }
}

