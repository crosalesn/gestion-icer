import { MilestoneResult } from '../entities/milestone-result.entity';
import { EvaluationMilestone } from '../value-objects/evaluation-milestone.enum';

export interface IMilestoneResultRepository {
  save(result: MilestoneResult): Promise<void>;
  findById(id: string): Promise<MilestoneResult | null>;
  findByCollaboratorId(collaboratorId: string): Promise<MilestoneResult[]>;
  findByCollaboratorAndMilestone(
    collaboratorId: string,
    milestone: EvaluationMilestone,
  ): Promise<MilestoneResult | null>;
}

