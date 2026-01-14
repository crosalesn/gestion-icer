import { EvaluationAssignment } from '../entities/evaluation-assignment.entity';
import { EvaluationMilestone } from '../value-objects/evaluation-milestone.enum';

export interface IEvaluationAssignmentRepository {
  save(assignment: EvaluationAssignment): Promise<EvaluationAssignment>;
  findById(id: number): Promise<EvaluationAssignment | null>;
  findByCollaboratorId(collaboratorId: number): Promise<EvaluationAssignment[]>;
  findByEvaluatorUserId(
    evaluatorUserId: number,
  ): Promise<EvaluationAssignment[]>;
  findPendingByEvaluatorUserId(
    evaluatorUserId: number,
  ): Promise<EvaluationAssignment[]>;
  findAllPending(): Promise<EvaluationAssignment[]>;
  findByCollaboratorAndMilestone(
    collaboratorId: number,
    milestone: EvaluationMilestone,
  ): Promise<EvaluationAssignment[]>;
}
