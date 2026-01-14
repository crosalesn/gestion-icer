import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { TargetRole } from '../../domain/value-objects/target-role.enum';
import { QuestionOrmEntity } from './question.orm-entity';

@Entity('evaluation_templates')
export class EvaluationTemplateOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  milestone: EvaluationMilestone;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'target_role',
  })
  targetRole: TargetRole;

  @Column()
  title: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  description: string | null;

  @OneToMany(() => QuestionOrmEntity, (question) => question.template, {
    eager: true,
  })
  questions: QuestionOrmEntity[];

  @Column({ type: 'bit', name: 'is_active', default: true })
  isActive: boolean;

  @Column('int', { default: 1 })
  version: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
