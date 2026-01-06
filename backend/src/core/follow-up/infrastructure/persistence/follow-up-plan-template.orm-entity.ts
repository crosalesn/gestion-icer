import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RiskLevel } from '../../../collaborators/domain/value-objects/risk-level.enum';

@Entity('follow_up_plan_templates')
export class FollowUpPlanTemplateOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'target_risk_level',
  })
  targetRiskLevel: RiskLevel;

  @Column({ name: 'duration_days' })
  durationDays: number;

  @Column({ name: 'meeting_frequency_days' })
  meetingFrequencyDays: number;

  @Column({ name: 'meeting_count' })
  meetingCount: number;

  @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
  description: string | null;

  @Column({ name: 'created_at', type: 'datetime2' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'datetime2' })
  updatedAt: Date;
}

