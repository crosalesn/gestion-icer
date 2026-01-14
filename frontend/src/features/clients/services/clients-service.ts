import api from '../../../shared/services/api-client';
import type { Client, CreateClientPayload, UpdateClientPayload } from '../types/client.types';

const normalizeClient = (data: Record<string, unknown>): Client => {
  return {
    id: (data.id || data._id || 0) as number,
    name: (data.name || data._name || '') as string,
    createdAt: (data.createdAt || data._createdAt || '') as string,
    updatedAt: (data.updatedAt || data._updatedAt || '') as string,
  };
};

const clientsService = {
  getAll: async (): Promise<Client[]> => {
    const response = await api.get<Record<string, unknown>[]>('/clients');
    
    if (!response.data || !Array.isArray(response.data)) {
      return [];
    }
    
    return response.data.map(normalizeClient);
  },

  getById: async (id: number): Promise<Client> => {
    const response = await api.get<Record<string, unknown>>(`/clients/${id}`);
    return normalizeClient(response.data);
  },

  create: async (data: CreateClientPayload): Promise<Client> => {
    const response = await api.post<Record<string, unknown>>('/clients', data);
    return normalizeClient(response.data);
  },

  update: async (id: number, data: UpdateClientPayload): Promise<Client> => {
    const response = await api.put<Record<string, unknown>>(`/clients/${id}`, data);
    return normalizeClient(response.data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/clients/${id}`);
  }
};

export default clientsService;

