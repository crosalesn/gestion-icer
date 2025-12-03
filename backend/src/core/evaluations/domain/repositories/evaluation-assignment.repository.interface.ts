import { EvaluationAssignment } from '../entities/evaluation-assignment.entity';
import { EvaluationMilestone } from '../value-objects/evaluation-milestone.enum';

export interface IEvaluationAssignmentRepository {
  save(assignment: EvaluationAssignment): Promise<void>;
  findById(id: string): Promise<EvaluationAssignment | null>;
  findByCollaboratorId(
    collaboratorId: string,
  ): Promise<EvaluationAssignment[]>;
  findByEvaluatorUserId(
    evaluatorUserId: string,
  ): Promise<EvaluationAssignment[]>;
  findPendingByEvaluatorUserId(
    evaluatorUserId: string,
  ): Promise<EvaluationAssignment[]>;
  findAllPending(): Promise<EvaluationAssignment[]>;
  findByCollaboratorAndMilestone(
    collaboratorId: string,
    milestone: EvaluationMilestone,
  ): Promise<EvaluationAssignment[]>;
}

