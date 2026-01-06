import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IEvaluationRepository } from '../../domain/repositories/evaluation.repository.interface';
import { Evaluation } from '../../domain/entities/evaluation.entity';
import { EvaluationOrmEntity } from './evaluation.orm-entity';
import { EvaluationMapper } from './evaluation.mapper';
import { EvaluationType } from '../../domain/value-objects/evaluation-type.enum';

@Injectable()
export class PostgresEvaluationRepository implements IEvaluationRepository {
  constructor(
    @InjectRepository(EvaluationOrmEntity)
    private readonly repository: Repository<EvaluationOrmEntity>,
  ) {}

  async save(evaluation: Evaluation): Promise<void> {
    const ormEntity = EvaluationMapper.toOrm(evaluation);
    await this.repository.save(ormEntity);
  }

  async findById(id: string): Promise<Evaluation | null> {
    const ormEntity = await this.repository.findOne({ where: { uuid: id } });
    return ormEntity ? EvaluationMapper.toDomain(ormEntity) : null;
  }

  async findByCollaboratorId(collaboratorId: string): Promise<Evaluation[]> {
    const ormEntities = await this.repository.find({
      where: { collaboratorId: Number(collaboratorId) },
      order: { createdAt: 'ASC' },
    });
    return ormEntities.map((orm) => EvaluationMapper.toDomain(orm));
  }

  async findByCollaboratorAndType(
    collaboratorId: string,
    type: EvaluationType,
  ): Promise<Evaluation | null> {
    const ormEntity = await this.repository.findOne({
      where: { collaboratorId: Number(collaboratorId), type },
    });
    return ormEntity ? EvaluationMapper.toDomain(ormEntity) : null;
  }
}

