import { Collaborator } from '../../domain/entities/collaborator.entity';
import { formatDateOnly } from '../../../../common/utils/date.utils';

export class CollaboratorResponseDto {
  id: string;
  name: string;
  email: string;
  admissionDate: string;
  project: string;
  role: string;
  teamLeader: string;
  clientId: string;
  status: string;
  riskLevel: string;
  createdAt: string;
  updatedAt: string;

  static fromDomain(domain: Collaborator): CollaboratorResponseDto {
    const dto = new CollaboratorResponseDto();
    dto.id = domain.id;
    dto.name = domain.name;
    dto.email = domain.email;
    // Solo fecha (YYYY-MM-DD) usando métodos locales para evitar problemas de TZ
    dto.admissionDate = formatDateOnly(domain.admissionDate);
    dto.project = domain.project;
    dto.role = domain.role;
    dto.teamLeader = domain.teamLeader;
    dto.clientId = domain.clientId;
    dto.status = domain.status;
    dto.riskLevel = domain.riskLevel;
    dto.createdAt = domain.createdAt.toISOString();
    dto.updatedAt = domain.updatedAt.toISOString();
    return dto;
  }
}

