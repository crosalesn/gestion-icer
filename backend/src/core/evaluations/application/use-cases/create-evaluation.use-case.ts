import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import type { IEvaluationRepository } from '../../domain/repositories/evaluation.repository.interface';
import { Evaluation } from '../../domain/entities/evaluation.entity';
import { CreateEvaluationCommand } from '../commands/create-evaluation.command';

@Injectable()
export class CreateEvaluationUseCase {
  constructor(
    @Inject('IEvaluationRepository')
    private readonly evaluationRepository: IEvaluationRepository,
  ) {}

  async execute(command: CreateEvaluationCommand): Promise<Evaluation> {
    // Check if evaluation already exists for this type
    const existingEvaluation =
      await this.evaluationRepository.findByCollaboratorAndType(
        command.collaboratorId,
        command.type,
      );

    if (existingEvaluation) {
      return existingEvaluation;
    }

    const id = uuidv4();
    const evaluation = Evaluation.create(id, command.collaboratorId, command.type);

    await this.evaluationRepository.save(evaluation);

    return evaluation;
  }
}

