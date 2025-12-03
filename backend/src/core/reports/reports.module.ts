import { Module } from '@nestjs/common';
import { ReportsController } from './presentation/controllers/reports.controller';
import { GetDashboardStatsUseCase } from './application/use-cases/get-dashboard-stats.use-case';
import { GetCollaboratorHistoryUseCase } from './application/use-cases/get-collaborator-history.use-case';
import { CollaboratorsModule } from '../collaborators/collaborators.module';
import { EvaluationsModule } from '../evaluations/evaluations.module';
import { ActionPlansModule } from '../action-plans/action-plans.module';

@Module({
  imports: [CollaboratorsModule, EvaluationsModule, ActionPlansModule],
  controllers: [ReportsController],
  providers: [GetDashboardStatsUseCase, GetCollaboratorHistoryUseCase],
})
export class ReportsModule {}

