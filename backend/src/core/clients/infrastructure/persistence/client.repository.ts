import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IClientRepository } from '../../domain/repositories/client.repository.interface';
import { Client } from '../../domain/entities/client.entity';
import { ClientOrmEntity } from './client.orm-entity';
import { ClientMapper } from './client.mapper';

@Injectable()
export class PostgresClientRepository implements IClientRepository {
  constructor(
    @InjectRepository(ClientOrmEntity)
    private readonly repository: Repository<ClientOrmEntity>,
  ) {}

  async save(client: Client): Promise<Client> {
    const ormEntity = ClientMapper.toOrm(client);
    const savedOrmEntity = await this.repository.save(ormEntity);
    return ClientMapper.toDomain(savedOrmEntity);
  }

  async findById(id: string): Promise<Client | null> {
    const ormEntity = await this.repository.findOne({
      where: { id: Number(id) },
    });
    return ormEntity ? ClientMapper.toDomain(ormEntity) : null;
  }

  async findAll(): Promise<Client[]> {
    const ormEntities = await this.repository.find({
      order: { name: 'ASC' },
    });
    return ormEntities.map((orm) => ClientMapper.toDomain(orm));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id: Number(id) });
  }
}
