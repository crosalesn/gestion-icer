import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { RiskLevel } from '../../../collaborators/domain/value-objects/risk-level.enum';

@Entity('milestone_results')
export class MilestoneResultOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'collaborator_id', type: 'int' })
  collaboratorId: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  milestone: EvaluationMilestone;

  @Column({
    name: 'collaborator_assignment_id',
    type: 'int',
    nullable: true,
  })
  collaboratorAssignmentId: number | null;

  @Column({
    name: 'team_leader_assignment_id',
    type: 'int',
    nullable: true,
  })
  teamLeaderAssignmentId: number | null;

  @Column({ name: 'final_score', type: 'float' })
  finalScore: number;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'risk_level',
  })
  riskLevel: RiskLevel;

  @Column({ name: 'calculated_at', type: 'datetime2' })
  calculatedAt: Date;

  @Column({ name: 'calculation_formula', type: 'nvarchar', length: 'MAX' })
  calculationFormula: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

