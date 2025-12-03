import { Inject, Injectable } from '@nestjs/common';
import type { ICollaboratorRepository } from '../../domain/repositories/collaborator.repository.interface';
import { Collaborator } from '../../domain/entities/collaborator.entity';

@Injectable()
export class FindAllCollaboratorsUseCase {
  constructor(
    @Inject('ICollaboratorRepository')
    private readonly collaboratorRepository: ICollaboratorRepository,
  ) {}

  async execute(): Promise<Collaborator[]> {
    return this.collaboratorRepository.findAll();
  }
}

