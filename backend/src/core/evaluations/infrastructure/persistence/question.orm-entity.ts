import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuestionType } from '../../domain/value-objects/question-type.enum';
import { EvaluationTemplateOrmEntity } from './evaluation-template.orm-entity';
import { DimensionOrmEntity } from './dimension.orm-entity';

@Entity('questions')
export class QuestionOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'template_id', type: 'int' })
  templateId: number;

  @ManyToOne(() => EvaluationTemplateOrmEntity)
  @JoinColumn({ name: 'template_id' })
  template: EvaluationTemplateOrmEntity;

  @Column({ type: 'nvarchar', length: 'MAX' })
  text: string;

  @Column({ name: 'dimension_id', type: 'int' })
  dimensionId: number;

  @ManyToOne(() => DimensionOrmEntity)
  @JoinColumn({ name: 'dimension_id' })
  dimension: DimensionOrmEntity;

  @Column({
    type: 'varchar',
    length: 50,
  })
  type: QuestionType;

  @Column('int')
  order: number;

  @Column('bit')
  required: boolean;

  @Column({ type: 'bit', name: 'is_active', default: true })
  isActive: boolean;
}
