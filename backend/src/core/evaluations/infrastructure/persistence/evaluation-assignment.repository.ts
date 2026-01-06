import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IEvaluationAssignmentRepository } from '../../domain/repositories/evaluation-assignment.repository.interface';
import { EvaluationAssignment } from '../../domain/entities/evaluation-assignment.entity';
import { EvaluationAssignmentOrmEntity } from './evaluation-assignment.orm-entity';
import { EvaluationAssignmentMapper } from './evaluation-assignment.mapper';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { EvaluationStatus } from '../../domain/value-objects/evaluation-status.enum';

@Injectable()
export class PostgresEvaluationAssignmentRepository
  implements IEvaluationAssignmentRepository
{
  constructor(
    @InjectRepository(EvaluationAssignmentOrmEntity)
    private readonly repository: Repository<EvaluationAssignmentOrmEntity>,
  ) {}

  async save(assignment: EvaluationAssignment): Promise<void> {
    const ormEntity = EvaluationAssignmentMapper.toOrm(assignment);
    await this.repository.save(ormEntity);
  }

  async findById(id: string): Promise<EvaluationAssignment | null> {
    const ormEntity = await this.repository.findOne({ where: { uuid: id } });
    return ormEntity ? EvaluationAssignmentMapper.toDomain(ormEntity) : null;
  }

  async findByCollaboratorId(
    collaboratorId: string,
  ): Promise<EvaluationAssignment[]> {
    const ormEntities = await this.repository.find({
      where: { collaboratorId: Number(collaboratorId) },
      order: { createdAt: 'ASC' },
    });
    return ormEntities.map((orm) => EvaluationAssignmentMapper.toDomain(orm));
  }

  async findByEvaluatorUserId(
    evaluatorUserId: string,
  ): Promise<EvaluationAssignment[]> {
    const ormEntities = await this.repository.find({
      where: { evaluatorUserId: Number(evaluatorUserId) },
      order: { createdAt: 'ASC' },
    });
    return ormEntities.map((orm) => EvaluationAssignmentMapper.toDomain(orm));
  }

  async findPendingByEvaluatorUserId(
    evaluatorUserId: string,
  ): Promise<EvaluationAssignment[]> {
    const ormEntities = await this.repository.find({
      where: {
        evaluatorUserId: Number(evaluatorUserId),
        status: EvaluationStatus.PENDING,
      },
      order: { dueDate: 'ASC' },
    });
    return ormEntities.map((orm) => EvaluationAssignmentMapper.toDomain(orm));
  }

  async findAllPending(): Promise<EvaluationAssignment[]> {
    const ormEntities = await this.repository.find({
      where: {
        status: EvaluationStatus.PENDING,
      },
      order: { dueDate: 'ASC' },
    });
    return ormEntities.map((orm) => EvaluationAssignmentMapper.toDomain(orm));
  }

  async findByCollaboratorAndMilestone(
    collaboratorId: string,
    milestone: EvaluationMilestone,
  ): Promise<EvaluationAssignment[]> {
    const ormEntities = await this.repository.find({
      where: { collaboratorId: Number(collaboratorId), milestone },
      order: { createdAt: 'ASC' },
    });
    return ormEntities.map((orm) => EvaluationAssignmentMapper.toDomain(orm));
  }
}

