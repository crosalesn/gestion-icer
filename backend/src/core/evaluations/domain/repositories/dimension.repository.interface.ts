import { Dimension } from '../entities/dimension.entity';

export interface IDimensionRepository {
  save(dimension: Dimension): Promise<void>;
  findById(id: string): Promise<Dimension | null>;
  findByCode(code: string): Promise<Dimension | null>;
  findAll(): Promise<Dimension[]>;
  findAllActive(): Promise<Dimension[]>;
}
