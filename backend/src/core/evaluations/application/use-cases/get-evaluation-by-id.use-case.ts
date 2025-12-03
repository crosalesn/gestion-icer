import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IEvaluationRepository } from '../../domain/repositories/evaluation.repository.interface';
import { Evaluation } from '../../domain/entities/evaluation.entity';

@Injectable()
export class GetEvaluationByIdUseCase {
  constructor(
    @Inject('IEvaluationRepository')
    private readonly evaluationRepository: IEvaluationRepository,
  ) {}

  async execute(id: string): Promise<Evaluation> {
    const evaluation = await this.evaluationRepository.findById(id);
    if (!evaluation) {
      throw new NotFoundException(`Evaluation with ID ${id} not found`);
    }
    return evaluation;
  }
}

