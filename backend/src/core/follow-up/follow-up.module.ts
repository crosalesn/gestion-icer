import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowUpPlanTemplateController } from './presentation/controllers/follow-up-plan-template.controller';
import { CreateFollowUpPlanTemplateUseCase } from './application/use-cases/create-follow-up-plan-template.use-case';
import { GetAllFollowUpPlanTemplatesUseCase } from './application/use-cases/get-all-follow-up-plan-templates.use-case';
import { UpdateFollowUpPlanTemplateUseCase } from './application/use-cases/update-follow-up-plan-template.use-case';
import { DeleteFollowUpPlanTemplateUseCase } from './application/use-cases/delete-follow-up-plan-template.use-case';
import { FollowUpPlanTemplateRepository } from './infrastructure/persistence/follow-up-plan-template.repository';
import { FollowUpPlanTemplateOrmEntity } from './infrastructure/persistence/follow-up-plan-template.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([FollowUpPlanTemplateOrmEntity])],
  controllers: [FollowUpPlanTemplateController],
  providers: [
    CreateFollowUpPlanTemplateUseCase,
    GetAllFollowUpPlanTemplatesUseCase,
    UpdateFollowUpPlanTemplateUseCase,
    DeleteFollowUpPlanTemplateUseCase,
    {
      provide: 'IFollowUpPlanTemplateRepository',
      useClass: FollowUpPlanTemplateRepository,
    },
  ],
  exports: [
    'IFollowUpPlanTemplateRepository', // Export repository to be used by other modules (like Evaluations)
  ],
})
export class FollowUpModule {}
