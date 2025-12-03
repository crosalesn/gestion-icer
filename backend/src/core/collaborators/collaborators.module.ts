import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollaboratorController } from './presentation/controllers/collaborator.controller';
import { CreateCollaboratorUseCase } from './application/use-cases/create-collaborator.use-case';
import { FindAllCollaboratorsUseCase } from './application/use-cases/find-all-collaborators.use-case';
import { FindCollaboratorByIdUseCase } from './application/use-cases/find-collaborator-by-id.use-case';
import { UpdateCollaboratorUseCase } from './application/use-cases/update-collaborator.use-case';
import { DeleteCollaboratorUseCase } from './application/use-cases/delete-collaborator.use-case';
import { PostgresCollaboratorRepository } from './infrastructure/persistence/collaborator.repository';
import { CollaboratorOrmEntity } from './infrastructure/persistence/collaborator.orm-entity';
import { EvaluationsModule } from '../evaluations/evaluations.module';
import { MilestoneResultOrmEntity } from '../evaluations/infrastructure/persistence/milestone-result.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CollaboratorOrmEntity, MilestoneResultOrmEntity]), // Register both entities
    forwardRef(() => EvaluationsModule), // Use forwardRef to avoid circular dependency
  ],
  controllers: [CollaboratorController],
  providers: [
    CreateCollaboratorUseCase,
    FindAllCollaboratorsUseCase,
    FindCollaboratorByIdUseCase,
    UpdateCollaboratorUseCase,
    DeleteCollaboratorUseCase,
    {
      provide: 'ICollaboratorRepository',
      useClass: PostgresCollaboratorRepository,
    },
  ],
  exports: ['ICollaboratorRepository'], // Export if other modules need it
})
export class CollaboratorsModule {}

