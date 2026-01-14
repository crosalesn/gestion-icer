import { Injectable, Inject, Logger } from '@nestjs/common';
import type { IDimensionRepository } from '../../domain/repositories/dimension.repository.interface';
import { UpdateDimensionCommand } from '../commands/update-dimension.command';
import { Dimension } from '../../domain/entities/dimension.entity';

@Injectable()
export class UpdateDimensionUseCase {
  private readonly logger = new Logger(UpdateDimensionUseCase.name);

  constructor(
    @Inject('IDimensionRepository')
    private readonly dimensionRepository: IDimensionRepository,
  ) {}

  async execute(command: UpdateDimensionCommand): Promise<Dimension> {
    this.logger.log(`Updating dimension ${command.id}`);

    const existingDimension = await this.dimensionRepository.findById(
      command.id,
    );
    if (!existingDimension) {
      throw new Error('Dimension not found');
    }

    // Check if code is being changed and if it already exists
    if (command.code && command.code !== existingDimension.code) {
      const existingByCode = await this.dimensionRepository.findByCode(
        command.code,
      );
      if (existingByCode) {
        throw new Error(`Dimension with code ${command.code} already exists`);
      }
    }

    // Reconstitute with updated values
    const updatedDimension = Dimension.reconstitute(
      existingDimension.id,
      command.code ?? existingDimension.code,
      command.name ?? existingDimension.name,
      command.description !== undefined
        ? command.description
        : existingDimension.description,
      command.order ?? existingDimension.order,
      command.isActive !== undefined
        ? command.isActive
        : existingDimension.isActive,
    );

    await this.dimensionRepository.save(updatedDimension);

    // Fetch the updated dimension
    const savedDimension = await this.dimensionRepository.findById(command.id);
    if (!savedDimension) {
      throw new Error('Failed to update dimension');
    }

    this.logger.log(`Dimension ${command.id} updated successfully`);
    return savedDimension;
  }
}
