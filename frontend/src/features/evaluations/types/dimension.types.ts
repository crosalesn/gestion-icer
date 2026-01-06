export interface Dimension {
  id: string;
  code: string;
  name: string;
  description: string | null;
  order: number;
  isActive: boolean;
}

export interface CreateDimensionPayload {
  code: string;
  name: string;
  description?: string | null;
  order: number;
  isActive?: boolean;
}

export interface UpdateDimensionPayload {
  code?: string;
  name?: string;
  description?: string | null;
  order?: number;
  isActive?: boolean;
}

