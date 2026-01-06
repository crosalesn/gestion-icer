import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IDimensionRepository } from '../../domain/repositories/dimension.repository.interface';
import { Dimension } from '../../domain/entities/dimension.entity';

@Injectable()
export class GetDimensionByIdUseCase {
  constructor(
    @Inject('IDimensionRepository')
    private readonly dimensionRepository: IDimensionRepository,
  ) {}

  async execute(id: string): Promise<Dimension> {
    const dimension = await this.dimensionRepository.findById(id);
    if (!dimension) {
      throw new NotFoundException(`Dimension with ID ${id} not found`);
    }
    return dimension;
  }
}

