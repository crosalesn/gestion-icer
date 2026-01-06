import { Inject, Injectable, Logger } from '@nestjs/common';
import { IClientRepository } from '../../domain/repositories/client.repository.interface';
import { Client } from '../../domain/entities/client.entity';
import { UpdateClientCommand } from '../commands/update-client.command';

@Injectable()
export class UpdateClientUseCase {
  private readonly logger = new Logger(UpdateClientUseCase.name);

  constructor(
    @Inject(IClientRepository)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(command: UpdateClientCommand): Promise<Client> {
    this.logger.log(`Updating client ${command.id}`);

    const client = await this.clientRepository.findById(command.id);
    if (!client) {
      throw new Error('Client not found');
    }

    // Check if name is being changed and if it already exists
    if (command.name.toLowerCase().trim() !== client.name.toLowerCase()) {
      const existingClients = await this.clientRepository.findAll();
      const existingClient = existingClients.find(
        (c) => c.id !== command.id && c.name.toLowerCase() === command.name.toLowerCase().trim(),
      );
      if (existingClient) {
        throw new Error('Client with this name already exists');
      }
    }

    client.updateName(command.name);
    const updatedClient = await this.clientRepository.save(client);

    this.logger.log(`Client ${command.id} updated successfully`);
    return updatedClient;
  }
}

