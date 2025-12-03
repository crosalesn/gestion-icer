import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICollaboratorRepository } from '../../domain/repositories/collaborator.repository.interface';
import { Collaborator } from '../../domain/entities/collaborator.entity';
import { CollaboratorOrmEntity } from './collaborator.orm-entity';
import { CollaboratorMapper } from './collaborator.mapper';

@Injectable()
export class PostgresCollaboratorRepository implements ICollaboratorRepository {
  constructor(
    @InjectRepository(CollaboratorOrmEntity)
    private readonly repository: Repository<CollaboratorOrmEntity>,
  ) {}

  async save(collaborator: Collaborator): Promise<void> {
    const ormEntity = CollaboratorMapper.toOrm(collaborator);
    await this.repository.save(ormEntity);
  }

  async findById(id: string): Promise<Collaborator | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? CollaboratorMapper.toDomain(ormEntity) : null;
  }

  async findByEmail(email: string): Promise<Collaborator | null> {
    const ormEntity = await this.repository.findOne({ where: { email } });
    return ormEntity ? CollaboratorMapper.toDomain(ormEntity) : null;
  }

  async findAll(): Promise<Collaborator[]> {
    const ormEntities = await this.repository.find();
    return ormEntities.map((orm) => CollaboratorMapper.toDomain(orm));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

