import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuestionDimension } from '../../domain/value-objects/question-dimension.enum';
import { QuestionType } from '../../domain/value-objects/question-type.enum';
import { EvaluationTemplateOrmEntity } from './evaluation-template.orm-entity';

@Entity('questions')
export class QuestionOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'template_id', type: 'uuid' })
  templateId: string;

  @ManyToOne(() => EvaluationTemplateOrmEntity)
  @JoinColumn({ name: 'template_id' })
  template: EvaluationTemplateOrmEntity;

  @Column('text')
  text: string;

  @Column({
    type: 'enum',
    enum: QuestionDimension,
  })
  dimension: QuestionDimension;

  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  type: QuestionType;

  @Column('int')
  order: number;

  @Column('boolean')
  required: boolean;
}

