import { Inject, Injectable } from '@nestjs/common';
import type { ICollaboratorRepository } from '../../../collaborators/domain/repositories/collaborator.repository.interface';
import { RiskLevel } from '../../../collaborators/domain/value-objects/risk-level.enum';
import { formatDateOnly } from '../../../../common/utils/date.utils';

export interface DashboardStats {
  totalCollaborators: number;
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
    none: number;
  };
  highRiskCollaborators: any[]; // Simplified collaborator view
}

@Injectable()
export class GetDashboardStatsUseCase {
  constructor(
    @Inject('ICollaboratorRepository')
    private readonly collaboratorRepository: ICollaboratorRepository,
  ) {}

  async execute(): Promise<DashboardStats> {
    const collaborators = await this.collaboratorRepository.findAll();

    const stats: DashboardStats = {
      totalCollaborators: collaborators.length,
      riskDistribution: {
        high: 0,
        medium: 0,
        low: 0,
        none: 0,
      },
      highRiskCollaborators: [],
    };

    collaborators.forEach((c) => {
      switch (c.riskLevel) {
        case RiskLevel.HIGH:
          stats.riskDistribution.high++;
          stats.highRiskCollaborators.push({
            id: c.id,
            name: c.name,
            project: c.project,
            riskLevel: c.riskLevel,
            admissionDate: formatDateOnly(c.admissionDate),
          });
          break;
        case RiskLevel.MEDIUM:
          stats.riskDistribution.medium++;
          break;
        case RiskLevel.LOW:
          stats.riskDistribution.low++;
          break;
        default:
          stats.riskDistribution.none++;
          break;
      }
    });

    return stats;
  }
}
