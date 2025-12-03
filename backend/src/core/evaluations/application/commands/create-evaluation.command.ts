import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { EvaluationType } from '../../domain/value-objects/evaluation-type.enum';

export class CreateEvaluationCommand {
  constructor(
    public readonly collaboratorId: string,
    public readonly type: EvaluationType,
  ) {}
}

