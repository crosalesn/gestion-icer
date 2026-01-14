import { Collaborator } from '../entities/collaborator.entity';

export interface ICollaboratorRepository {
  save(collaborator: Collaborator): Promise<Collaborator>;
  findById(id: number): Promise<Collaborator | null>;
  findByEmail(email: string): Promise<Collaborator | null>;
  findAll(): Promise<Collaborator[]>;
  delete(id: number): Promise<void>;
}
