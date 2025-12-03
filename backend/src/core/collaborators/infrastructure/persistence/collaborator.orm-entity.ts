import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CollaboratorStatus } from '../../domain/value-objects/collaborator-status.enum';
import { RiskLevel } from '../../domain/value-objects/risk-level.enum';

@Entity('collaborators')
export class CollaboratorOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'admission_date' })
  admissionDate: Date;

  @Column()
  project: string;

  @Column()
  role: string;

  @Column({ name: 'team_leader' })
  teamLeader: string;

  @Column({
    type: 'enum',
    enum: CollaboratorStatus,
    default: CollaboratorStatus.PENDING_DAY_1,
  })
  status: CollaboratorStatus;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    default: RiskLevel.NONE,
    name: 'risk_level',
  })
  riskLevel: RiskLevel;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
