import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EvaluationType } from '../../domain/value-objects/evaluation-type.enum';
import { EvaluationStatus } from '../../domain/value-objects/evaluation-status.enum';

@Entity('evaluations')
export class EvaluationOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uniqueidentifier', unique: true, default: () => 'NEWID()' })
  uuid: string;

  @Column({ name: 'collaborator_id', type: 'int' })
  collaboratorId: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  type: EvaluationType;

  @Column({
    type: 'varchar',
    length: 50,
    default: EvaluationStatus.PENDING,
  })
  status: EvaluationStatus;

  @Column('nvarchar', { length: 'MAX', default: '{}' })
  answers: Record<string, number | string>;

  @Column('float', { nullable: true })
  score: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'completed_at', type: 'datetime2', nullable: true })
  completedAt: Date | null;
}

