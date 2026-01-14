import { Injectable, Inject, Logger } from '@nestjs/common';
import type { IDimensionRepository } from '../../domain/repositories/dimension.repository.interface';
import { Dimension } from '../../domain/entities/dimension.entity';

@Injectable()
export class DeleteDimensionUseCase {
  private readonly logger = new Logger(DeleteDimensionUseCase.name);

  constructor(
    @Inject('IDimensionRepository')
    private readonly dimensionRepository: IDimensionRepository,
  ) {}

  async execute(id: string): Promise<void> {
    this.logger.log(`Deleting dimension ${id}`);

    const dimension = await this.dimensionRepository.findById(id);
    if (!dimension) {
      throw new Error('Dimension not found');
    }

    // Instead of hard delete, we'll deactivate the dimension
    // This is safer as dimensions might be referenced by questions
    const deactivatedDimension = Dimension.reconstitute(
      dimension.id,
      dimension.code,
      dimension.name,
      dimension.description,
      dimension.order,
      false, // isActive = false
    );

    await this.dimensionRepository.save(deactivatedDimension);

    this.logger.log(`Dimension ${id} deactivated successfully`);
  }
}
