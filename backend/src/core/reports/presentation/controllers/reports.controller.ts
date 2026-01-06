import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GetDashboardStatsUseCase } from '../../application/use-cases/get-dashboard-stats.use-case';
import { GetCollaboratorHistoryUseCase } from '../../application/use-cases/get-collaborator-history.use-case';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(
    private readonly getDashboardStatsUseCase: GetDashboardStatsUseCase,
    private readonly getCollaboratorHistoryUseCase: GetCollaboratorHistoryUseCase,
  ) {}

  @Get('dashboard')
  async getDashboard() {
    return this.getDashboardStatsUseCase.execute();
  }

  @Get('collaborator/:id')
  async getCollaboratorHistory(@Param('id') id: string) {
    return this.getCollaboratorHistoryUseCase.execute(id);
  }
}

