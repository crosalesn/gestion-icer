import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { EvaluationStatus } from '../../domain/value-objects/evaluation-status.enum';

@Entity('evaluation_assignments')
export class EvaluationAssignmentOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'collaborator_id', type: 'int' })
  collaboratorId: number;

  @Column({ name: 'evaluator_user_id', type: 'int', nullable: true })
  evaluatorUserId: number | null;

  @Column({ name: 'template_id', type: 'int' })
  templateId: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  milestone: EvaluationMilestone;

  @Column({
    type: 'varchar',
    length: 50,
    default: EvaluationStatus.PENDING,
  })
  status: EvaluationStatus;

  @Column({ name: 'due_date', type: 'datetime2' })
  dueDate: Date;

  @Column({ name: 'completed_at', type: 'datetime2', nullable: true })
  completedAt: Date | null;

  @Column('simple-json', { default: '[]' })
  answers: Array<{ questionId: string; value: number | string }>;

  @Column('float', { nullable: true })
  score: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
