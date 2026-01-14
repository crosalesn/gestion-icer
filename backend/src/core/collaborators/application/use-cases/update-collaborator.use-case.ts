import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ICollaboratorRepository } from '../../domain/repositories/collaborator.repository.interface';
import { Collaborator } from '../../domain/entities/collaborator.entity';
import { UpdateCollaboratorCommand } from '../commands/update-collaborator.command';

@Injectable()
export class UpdateCollaboratorUseCase {
  private readonly logger = new Logger(UpdateCollaboratorUseCase.name);

  constructor(
    @Inject('ICollaboratorRepository')
    private readonly collaboratorRepository: ICollaboratorRepository,
  ) {}

  async execute(command: UpdateCollaboratorCommand): Promise<Collaborator> {
    this.logger.log(`Updating collaborator ${command.id}`);

    const collaborator = await this.collaboratorRepository.findById(command.id);
    if (!collaborator) {
      throw new Error('Collaborator not found');
    }

    // Check if email is being changed and if it already exists
    if (command.email !== collaborator.email) {
      const existingCollaborator =
        await this.collaboratorRepository.findByEmail(command.email);
      if (existingCollaborator) {
        throw new Error('Collaborator with this email already exists');
      }
    }

    // Reconstitute with updated values
    const updatedCollaborator = Collaborator.reconstitute(
      collaborator.id!,
      command.name,
      command.email,
      command.admissionDate,
      command.project,
      command.role,
      command.teamLeader,
      command.clientId,
      collaborator.status,
      collaborator.riskLevel,
      collaborator.createdAt,
      new Date(),
    );

    const savedCollaborator =
      await this.collaboratorRepository.save(updatedCollaborator);

    this.logger.log(`Collaborator ${command.id} updated successfully`);
    return savedCollaborator;
  }
}
