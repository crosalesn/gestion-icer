import api from '../../../shared/services/api-client';
import type { Dimension, CreateDimensionPayload, UpdateDimensionPayload } from '../types/dimension.types';

const dimensionsService = {
  getAll: async (): Promise<Dimension[]> => {
    const response = await api.get<Dimension[]>('/dimensions');
    return response.data;
  },

  getById: async (id: string): Promise<Dimension> => {
    const response = await api.get<Dimension>(`/dimensions/${id}`);
    return response.data;
  },

  create: async (payload: CreateDimensionPayload): Promise<Dimension> => {
    const response = await api.post<Dimension>('/dimensions', payload);
    return response.data;
  },

  update: async (id: string, payload: UpdateDimensionPayload): Promise<Dimension> => {
    const response = await api.put<Dimension>(`/dimensions/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/dimensions/${id}`);
  },
};

export default dimensionsService;

