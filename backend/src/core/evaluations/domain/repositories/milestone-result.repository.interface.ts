import { MilestoneResult } from '../entities/milestone-result.entity';
import { EvaluationMilestone } from '../value-objects/evaluation-milestone.enum';

export interface IMilestoneResultRepository {
  save(result: MilestoneResult): Promise<MilestoneResult>;
  findById(id: number): Promise<MilestoneResult | null>;
  findByCollaboratorId(collaboratorId: number): Promise<MilestoneResult[]>;
  findByCollaboratorAndMilestone(
    collaboratorId: number,
    milestone: EvaluationMilestone,
  ): Promise<MilestoneResult | null>;
}
