import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CollaboratorStatus } from '../../domain/value-objects/collaborator-status.enum';
import { RiskLevel } from '../../domain/value-objects/risk-level.enum';
import { ClientOrmEntity } from '../../../clients/infrastructure/persistence/client.orm-entity';

@Entity('collaborators')
export class CollaboratorOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ name: 'client_id', type: 'int', nullable: false })
  clientId: number;

  @ManyToOne(() => ClientOrmEntity)
  @JoinColumn({ name: 'client_id' })
  client: ClientOrmEntity;

  @Column({
    type: 'varchar',
    length: 50,
    default: CollaboratorStatus.PENDING_DAY_1,
  })
  status: CollaboratorStatus;

  @Column({
    type: 'varchar',
    length: 50,
    default: RiskLevel.NONE,
    name: 'risk_level',
  })
  riskLevel: RiskLevel;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
