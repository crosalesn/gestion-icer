import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import type { ICollaboratorRepository } from '../../domain/repositories/collaborator.repository.interface';
import { Collaborator } from '../../domain/entities/collaborator.entity';
import { CreateCollaboratorCommand } from '../commands/create-collaborator.command';
import { AssignEvaluationUseCase } from '../../../evaluations/application/use-cases/assign-evaluation.use-case';
import { AssignEvaluationCommand } from '../../../evaluations/application/commands/assign-evaluation.command';
import { EvaluationMilestone } from '../../../evaluations/domain/value-objects/evaluation-milestone.enum';

@Injectable()
export class CreateCollaboratorUseCase {
  private readonly logger = new Logger(CreateCollaboratorUseCase.name);

  constructor(
    @Inject('ICollaboratorRepository')
    private readonly collaboratorRepository: ICollaboratorRepository,
    @Inject(forwardRef(() => AssignEvaluationUseCase))
    private readonly assignEvaluationUseCase: AssignEvaluationUseCase,
  ) {}

  async execute(command: CreateCollaboratorCommand): Promise<Collaborator> {
    // Check if email already exists
    const existingCollaborator = await this.collaboratorRepository.findByEmail(
      command.email,
    );
    if (existingCollaborator) {
      throw new Error('Collaborator with this email already exists');
    }

    const collaborator = Collaborator.create(
      command.name,
      command.email,
      command.admissionDate,
      command.project,
      command.role,
      command.teamLeader,
      command.clientId,
    );

    const savedCollaborator =
      await this.collaboratorRepository.save(collaborator);

    // Auto-assign Day 1 Evaluation
    try {
      this.logger.log(
        `Auto-assigning Day 1 evaluation for new collaborator ${savedCollaborator.id}`,
      );
      const assignCommand = new AssignEvaluationCommand(
        savedCollaborator.id!,
        EvaluationMilestone.DAY_1,
      );
      await this.assignEvaluationUseCase.execute(assignCommand);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(
        `Failed to auto-assign Day 1 evaluation for collaborator ${savedCollaborator.id}: ${errorMessage}`,
      );
    }

    return savedCollaborator;
  }
}
