import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { EvaluationStatus } from '../../domain/value-objects/evaluation-status.enum';

@Entity('evaluation_assignments')
export class EvaluationAssignmentOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'collaborator_id', type: 'uuid' })
  collaboratorId: string;

  @Column({ name: 'evaluator_user_id', type: 'uuid', nullable: true })
  evaluatorUserId: string | null;

  @Column({ name: 'template_id', type: 'uuid' })
  templateId: string;

  @Column({
    type: 'enum',
    enum: EvaluationMilestone,
  })
  milestone: EvaluationMilestone;

  @Column({
    type: 'enum',
    enum: EvaluationStatus,
    default: EvaluationStatus.PENDING,
  })
  status: EvaluationStatus;

  @Column({ name: 'due_date', type: 'timestamp' })
  dueDate: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @Column('jsonb', { default: [] })
  answers: Array<{ questionId: string; value: number | string }>;

  @Column('float', { nullable: true })
  score: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

