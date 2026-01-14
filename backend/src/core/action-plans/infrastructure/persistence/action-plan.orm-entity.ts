import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ActionPlanType } from '../../domain/value-objects/action-plan-type.enum';
import { ActionPlanStatus } from '../../domain/value-objects/action-plan-status.enum';

@Entity('action_plans')
export class ActionPlanOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'collaborator_id', type: 'int' })
  collaboratorId: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  type: ActionPlanType;

  @Column({ type: 'nvarchar', length: 'MAX' })
  description: string;

  @Column({ type: 'nvarchar', length: 'MAX' })
  goals: string[];

  @Column({
    type: 'varchar',
    length: 50,
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
