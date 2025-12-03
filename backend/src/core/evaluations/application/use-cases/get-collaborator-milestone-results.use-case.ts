import { Injectable, Inject } from '@nestjs/common';
import type { IMilestoneResultRepository } from '../../domain/repositories/milestone-result.repository.interface';
import { MilestoneResult } from '../../domain/entities/milestone-result.entity';

@Injectable()
export class GetCollaboratorMilestoneResultsUseCase {
  constructor(
    @Inject('IMilestoneResultRepository')
    private readonly milestoneResultRepository: IMilestoneResultRepository,
  ) {}

  async execute(collaboratorId: string): Promise<MilestoneResult[]> {
    return this.milestoneResultRepository.findByCollaboratorId(collaboratorId);
  }
}



