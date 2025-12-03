import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { TargetRole } from '../../domain/value-objects/target-role.enum';
import { QuestionOrmEntity } from './question.orm-entity';

@Entity('evaluation_templates')
export class EvaluationTemplateOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EvaluationMilestone,
  })
  milestone: EvaluationMilestone;

  @Column({
    type: 'enum',
    enum: TargetRole,
    name: 'target_role',
  })
  targetRole: TargetRole;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string | null;

  @OneToMany(() => QuestionOrmEntity, (question) => question.template, {
    cascade: true,
    eager: true,
  })
  questions: QuestionOrmEntity[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column('int', { default: 1 })
  version: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

