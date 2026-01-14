import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ICollaboratorRepository } from '../../domain/repositories/collaborator.repository.interface';
import { DeleteCollaboratorCommand } from '../commands/delete-collaborator.command';

@Injectable()
export class DeleteCollaboratorUseCase {
  private readonly logger = new Logger(DeleteCollaboratorUseCase.name);

  constructor(
    @Inject('ICollaboratorRepository')
    private readonly collaboratorRepository: ICollaboratorRepository,
  ) {}

  async execute(command: DeleteCollaboratorCommand): Promise<void> {
    this.logger.log(`Deleting collaborator ${command.id}`);

    const collaborator = await this.collaboratorRepository.findById(command.id);
    if (!collaborator) {
      throw new Error('Collaborator not found');
    }

    await this.collaboratorRepository.delete(command.id);

    this.logger.log(`Collaborator ${command.id} deleted successfully`);
  }
}
