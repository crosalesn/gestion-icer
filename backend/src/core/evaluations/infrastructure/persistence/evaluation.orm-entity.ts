import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EvaluationType } from '../../domain/value-objects/evaluation-type.enum';
import { EvaluationStatus } from '../../domain/value-objects/evaluation-status.enum';

@Entity('evaluations')
export class EvaluationOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'collaborator_id' })
  collaboratorId: string;

  @Column({
    type: 'enum',
    enum: EvaluationType,
  })
  type: EvaluationType;

  @Column({
    type: 'enum',
    enum: EvaluationStatus,
    default: EvaluationStatus.PENDING,
  })
  status: EvaluationStatus;

  @Column('jsonb', { default: {} })
  answers: Record<string, number | string>;

  @Column('float', { nullable: true })
  score: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date | null;
}

