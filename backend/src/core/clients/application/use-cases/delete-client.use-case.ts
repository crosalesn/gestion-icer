import { Inject, Injectable, Logger } from '@nestjs/common';
import { IClientRepository } from '../../domain/repositories/client.repository.interface';
import { DeleteClientCommand } from '../commands/delete-client.command';

@Injectable()
export class DeleteClientUseCase {
  private readonly logger = new Logger(DeleteClientUseCase.name);

  constructor(
    @Inject(IClientRepository)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(command: DeleteClientCommand): Promise<void> {
    this.logger.log(`Deleting client ${command.id}`);

    const client = await this.clientRepository.findById(command.id);
    if (!client) {
      throw new Error('Client not found');
    }

    await this.clientRepository.delete(command.id);

    this.logger.log(`Client ${command.id} deleted successfully`);
  }
}
