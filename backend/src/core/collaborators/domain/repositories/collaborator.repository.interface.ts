import { Collaborator } from '../entities/collaborator.entity';

export interface ICollaboratorRepository {
  save(collaborator: Collaborator): Promise<void>;
  findById(id: string): Promise<Collaborator | null>;
  findByEmail(email: string): Promise<Collaborator | null>;
  findAll(): Promise<Collaborator[]>;
  delete(id: string): Promise<void>;
}

