import { Client } from '../entities/client.entity';

export const IClientRepository = Symbol('IClientRepository');

export interface IClientRepository {
  save(client: Client): Promise<Client>;
  findById(id: string): Promise<Client | null>;
  findAll(): Promise<Client[]>;
  delete(id: string): Promise<void>;
}
