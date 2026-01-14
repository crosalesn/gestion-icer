import { Injectable, Inject, Logger } from '@nestjs/common';
import type { IDimensionRepository } from '../../domain/repositories/dimension.repository.interface';
import { Dimension } from '../../domain/entities/dimension.entity';

@Injectable()
export class GetAllDimensionsUseCase {
  private readonly logger = new Logger(GetAllDimensionsUseCase.name);

  constructor(
    @Inject('IDimensionRepository')
    private readonly dimensionRepository: IDimensionRepository,
  ) {}

  async execute(): Promise<Dimension[]> {
    // Return all dimensions (active and inactive) for administration purposes
    // Frontend can filter by isActive if needed
    return this.dimensionRepository.findAll();
  }
}
