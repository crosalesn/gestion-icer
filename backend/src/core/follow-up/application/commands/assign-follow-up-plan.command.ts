import { RiskLevel } from '../../../collaborators/domain/value-objects/risk-level.enum';

export class AssignFollowUpPlanCommand {
  constructor(
    public readonly collaboratorId: string,
    public readonly riskLevel: RiskLevel,
  ) {}
}

