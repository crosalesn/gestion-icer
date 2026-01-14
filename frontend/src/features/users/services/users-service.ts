import api from '../../../shared/services/api-client';
import type { User, CreateUserPayload, UpdateUserPayload } from '../types/user.types';

// Función helper para normalizar los datos del backend
const normalizeUser = (data: any): User => {
  // El backend puede devolver campos con _ (privados) o sin _
  return {
    id: data.id || data._id || '',
    name: data.name || data._name || '',
    email: data.email || data._email || '',
    role: (data.role || data._role || 'COLLABORATOR') as User['role'],
    isActive: data.isActive !== undefined ? data.isActive : (data._isActive !== undefined ? data._isActive : true),
    createdAt: data.createdAt || data._createdAt || '',
    updatedAt: data.updatedAt || data._updatedAt || '',
  };
};

const usersService = {
  getById: async (id: string) => {
    const response = await api.get<any>(`/users/${id}`);
    return normalizeUser(response.data);
  },

  getAll: async () => {
    try {
      const response = await api.get<any[]>('/users');
      console.log('Users API Response:', response);
      console.log('Users Response data:', response.data);
      
      if (!response.data) {
        console.warn('Response data is null or undefined');
        return [];
      }
      
      if (!Array.isArray(response.data)) {
        console.warn('Response data is not an array:', response.data);
        return [];
      }
      
      // Normalizar los datos para manejar campos con _ o sin _
      const normalized = response.data.map(normalizeUser);
      console.log('Normalized users data:', normalized);
      return normalized;
    } catch (error: any) {
      console.error('Error in getAll:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  },

  create: async (data: CreateUserPayload) => {
    const response = await api.post<any>('/users', data);
    return normalizeUser(response.data);
  },

  update: async (id: number | string, data: UpdateUserPayload) => {
    const response = await api.put<any>(`/users/${id}`, data);
    return normalizeUser(response.data);
  },

  // Helper for seeding if needed based on capabilities doc
  seed: async () => {
    const response = await api.post<any>('/users/seed');
    return response.data;
  }
};

export default usersService;

