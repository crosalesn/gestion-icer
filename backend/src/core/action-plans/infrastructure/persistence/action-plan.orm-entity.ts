import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ActionPlanType } from '../../domain/value-objects/action-plan-type.enum';
import { ActionPlanStatus } from '../../domain/value-objects/action-plan-status.enum';

@Entity('action_plans')
export class ActionPlanOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'collaborator_id' })
  collaboratorId: string;

  @Column({
    type: 'enum',
    enum: ActionPlanType,
  })
  type: ActionPlanType;

  @Column('text')
  description: string;

  @Column('simple-array')
  goals: string[];

  @Column({
    type: 'enum',
    enum: ActionPlanStatus,
    default: ActionPlanStatus.ACTIVE,
  })
  status: ActionPlanStatus;

  @Column({ name: 'due_date' })
  dueDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

