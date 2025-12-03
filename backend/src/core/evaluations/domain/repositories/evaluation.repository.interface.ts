import { Evaluation } from '../entities/evaluation.entity';
import { EvaluationType } from '../value-objects/evaluation-type.enum';

export interface IEvaluationRepository {
  save(evaluation: Evaluation): Promise<void>;
  findById(id: string): Promise<Evaluation | null>;
  findByCollaboratorId(collaboratorId: string): Promise<Evaluation[]>;
  findByCollaboratorAndType(
    collaboratorId: string,
    type: EvaluationType,
  ): Promise<Evaluation | null>;
}

