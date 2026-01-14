import { Inject, Injectable } from '@nestjs/common';
import { IClientRepository } from '../../domain/repositories/client.repository.interface';
import { Client } from '../../domain/entities/client.entity';

@Injectable()
export class FindAllClientsUseCase {
  constructor(
    @Inject(IClientRepository)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(): Promise<Client[]> {
    return this.clientRepository.findAll();
  }
}
