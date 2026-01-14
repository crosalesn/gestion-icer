import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ICollaboratorRepository } from '../../domain/repositories/collaborator.repository.interface';
import { Collaborator } from '../../domain/entities/collaborator.entity';

@Injectable()
export class FindCollaboratorByIdUseCase {
  constructor(
    @Inject('ICollaboratorRepository')
    private readonly collaboratorRepository: ICollaboratorRepository,
  ) {}

  async execute(id: number): Promise<Collaborator> {
    const collaborator = await this.collaboratorRepository.findById(id);
    if (!collaborator) {
      throw new NotFoundException(`Collaborator with ID ${id} not found`);
    }
    return collaborator;
  }
}
