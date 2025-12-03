import { Inject, Injectable } from '@nestjs/common';
import type { IEvaluationRepository } from '../../domain/repositories/evaluation.repository.interface';
import { Evaluation } from '../../domain/entities/evaluation.entity';

@Injectable()
export class GetCollaboratorEvaluationsUseCase {
  constructor(
    @Inject('IEvaluationRepository')
    private readonly evaluationRepository: IEvaluationRepository,
  ) {}

  async execute(collaboratorId: string): Promise<Evaluation[]> {
    return this.evaluationRepository.findByCollaboratorId(collaboratorId);
  }
}

