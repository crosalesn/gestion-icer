import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionPlanController } from './presentation/controllers/action-plan.controller';
import { AssignActionPlanUseCase } from './application/use-cases/assign-action-plan.use-case';
import { GetCollaboratorActionPlansUseCase } from './application/use-cases/get-collaborator-action-plans.use-case';
import { GetAllActionPlansUseCase } from './application/use-cases/get-all-action-plans.use-case';
import { PostgresActionPlanRepository } from './infrastructure/persistence/action-plan.repository';
import { ActionPlanOrmEntity } from './infrastructure/persistence/action-plan.orm-entity';
import { CollaboratorsModule } from '../collaborators/collaborators.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActionPlanOrmEntity]),
    forwardRef(() => CollaboratorsModule),
  ],
  controllers: [ActionPlanController],
  providers: [
    AssignActionPlanUseCase,
    GetCollaboratorActionPlansUseCase,
    GetAllActionPlansUseCase,
    {
      provide: 'IActionPlanRepository',
      useClass: PostgresActionPlanRepository,
    },
  ],
  exports: ['IActionPlanRepository', AssignActionPlanUseCase],
})
export class ActionPlansModule {}

