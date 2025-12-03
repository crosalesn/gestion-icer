import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationController } from './presentation/controllers/evaluation.controller';
import { SeedController } from './presentation/controllers/seed.controller';
import { CreateEvaluationUseCase } from './application/use-cases/create-evaluation.use-case';
import { SubmitEvaluationUseCase } from './application/use-cases/submit-evaluation.use-case';
import { GetCollaboratorEvaluationsUseCase } from './application/use-cases/get-collaborator-evaluations.use-case';
import { GetEvaluationByIdUseCase } from './application/use-cases/get-evaluation-by-id.use-case';
import { PostgresEvaluationRepository } from './infrastructure/persistence/evaluation.repository';
import { EvaluationOrmEntity } from './infrastructure/persistence/evaluation.orm-entity';
import { CollaboratorsModule } from '../collaborators/collaborators.module';
import { UsersModule } from '../users/users.module';
import { ActionPlansModule } from '../action-plans/action-plans.module';
import { EvaluationTemplateOrmEntity } from './infrastructure/persistence/evaluation-template.orm-entity';
import { QuestionOrmEntity } from './infrastructure/persistence/question.orm-entity';
import { EvaluationAssignmentOrmEntity } from './infrastructure/persistence/evaluation-assignment.orm-entity';
import { MilestoneResultOrmEntity } from './infrastructure/persistence/milestone-result.orm-entity';
import { PostgresEvaluationTemplateRepository } from './infrastructure/persistence/evaluation-template.repository';
import { PostgresEvaluationAssignmentRepository } from './infrastructure/persistence/evaluation-assignment.repository';
import { PostgresMilestoneResultRepository } from './infrastructure/persistence/milestone-result.repository';
import { AssignEvaluationUseCase } from './application/use-cases/assign-evaluation.use-case';
import { GetPendingEvaluationsUseCase } from './application/use-cases/get-pending-evaluations.use-case';
import { SubmitAssignmentAnswersUseCase } from './application/use-cases/submit-assignment-answers.use-case';
import { CalculateMilestoneResultUseCase } from './application/use-cases/calculate-milestone-result.use-case';
import { CreateTemplateUseCase } from './application/use-cases/create-template.use-case';
import { UpdateTemplateUseCase } from './application/use-cases/update-template.use-case';
import { GetAllTemplatesUseCase } from './application/use-cases/get-all-templates.use-case';
import { SeedTemplatesUseCase } from './application/use-cases/seed-templates.use-case';
import { GetCollaboratorMilestoneResultsUseCase } from './application/use-cases/get-collaborator-milestone-results.use-case';
import { GetCollaboratorCompletedAssignmentsUseCase } from './application/use-cases/get-collaborator-completed-assignments.use-case';
import { GetTemplateByIdUseCase } from './application/use-cases/get-template-by-id.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EvaluationOrmEntity,
      EvaluationTemplateOrmEntity,
      QuestionOrmEntity,
      EvaluationAssignmentOrmEntity,
      MilestoneResultOrmEntity,
    ]),
    forwardRef(() => CollaboratorsModule), // Use forwardRef to avoid circular dependency
    UsersModule,
    ActionPlansModule,
  ],
  controllers: [EvaluationController, SeedController],
  providers: [
    CreateEvaluationUseCase,
    SubmitEvaluationUseCase,
    GetCollaboratorEvaluationsUseCase,
    GetEvaluationByIdUseCase,
    AssignEvaluationUseCase,
    GetPendingEvaluationsUseCase,
    SubmitAssignmentAnswersUseCase,
    CalculateMilestoneResultUseCase,
    CreateTemplateUseCase,
    UpdateTemplateUseCase,
    GetAllTemplatesUseCase,
    SeedTemplatesUseCase,
    GetCollaboratorMilestoneResultsUseCase,
    GetCollaboratorCompletedAssignmentsUseCase,
    GetTemplateByIdUseCase,
    {
      provide: 'IEvaluationRepository',
      useClass: PostgresEvaluationRepository,
    },
    {
      provide: 'IEvaluationTemplateRepository',
      useClass: PostgresEvaluationTemplateRepository,
    },
    {
      provide: 'IEvaluationAssignmentRepository',
      useClass: PostgresEvaluationAssignmentRepository,
    },
    {
      provide: 'IMilestoneResultRepository',
      useClass: PostgresMilestoneResultRepository,
    },
  ],
  exports: [
    'IEvaluationRepository',
    'IEvaluationTemplateRepository',
    'IEvaluationAssignmentRepository',
    'IMilestoneResultRepository',
    AssignEvaluationUseCase,
  ],
})
export class EvaluationsModule {}

