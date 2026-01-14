import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IDimensionRepository } from '../../domain/repositories/dimension.repository.interface';
import { Dimension } from '../../domain/entities/dimension.entity';
import { DimensionOrmEntity } from './dimension.orm-entity';
import { DimensionMapper } from './dimension.mapper';

@Injectable()
export class PostgresDimensionRepository implements IDimensionRepository {
  constructor(
    @InjectRepository(DimensionOrmEntity)
    private readonly repository: Repository<DimensionOrmEntity>,
  ) {}

  async save(dimension: Dimension): Promise<void> {
    const ormEntity = DimensionMapper.toOrm(dimension);
    await this.repository.save(ormEntity);
  }

  async findById(id: string): Promise<Dimension | null> {
    const ormEntity = await this.repository.findOne({
      where: { id: Number(id) },
    });
    return ormEntity ? DimensionMapper.toDomain(ormEntity) : null;
  }

  async findByCode(code: string): Promise<Dimension | null> {
    const ormEntity = await this.repository.findOne({
      where: { code },
    });
    return ormEntity ? DimensionMapper.toDomain(ormEntity) : null;
  }

  async findAll(): Promise<Dimension[]> {
    const ormEntities = await this.repository.find({
      order: { order: 'ASC' },
    });
    return ormEntities.map((orm) => DimensionMapper.toDomain(orm));
  }

  async findAllActive(): Promise<Dimension[]> {
    const ormEntities = await this.repository.find({
      where: { isActive: true },
      order: { order: 'ASC' },
    });
    return ormEntities.map((orm) => DimensionMapper.toDomain(orm));
  }
}
