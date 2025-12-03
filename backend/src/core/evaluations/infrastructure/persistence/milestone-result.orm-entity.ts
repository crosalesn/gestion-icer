import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EvaluationMilestone } from '../../domain/value-objects/evaluation-milestone.enum';
import { RiskLevel } from '../../../collaborators/domain/value-objects/risk-level.enum';

@Entity('milestone_results')
export class MilestoneResultOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'collaborator_id', type: 'uuid' })
  collaboratorId: string;

  @Column({
    type: 'enum',
    enum: EvaluationMilestone,
  })
  milestone: EvaluationMilestone;

  @Column({
    name: 'collaborator_assignment_id',
    type: 'uuid',
    nullable: true,
  })
  collaboratorAssignmentId: string | null;

  @Column({
    name: 'team_leader_assignment_id',
    type: 'uuid',
    nullable: true,
  })
  teamLeaderAssignmentId: string | null;

  @Column({ name: 'final_score', type: 'float' })
  finalScore: number;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    name: 'risk_level',
  })
  riskLevel: RiskLevel;

  @Column({ name: 'calculated_at', type: 'timestamp' })
  calculatedAt: Date;

  @Column({ name: 'calculation_formula', type: 'text' })
  calculationFormula: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

