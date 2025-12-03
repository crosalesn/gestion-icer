import api from '../../../shared/services/api-client';
import type { Collaborator, CreateCollaboratorPayload, UpdateCollaboratorPayload } from '../types/collaborator.types';

// Función helper para normalizar los datos del backend
const normalizeCollaborator = (data: any): Collaborator => {
  // El backend puede devolver campos con _ (privados) o sin _, también puede venir en snake_case
  const riskLevel = data.riskLevel || data._riskLevel || data.risk_level || data._risk_level || 'NONE';
  
  // Log para debug
  if (!data.riskLevel && !data._riskLevel && !data.risk_level && !data._risk_level) {
    console.warn('Collaborator missing riskLevel:', {
      id: data.id,
      name: data.name,
      allKeys: Object.keys(data),
      data: data
    });
  }
  
  return {
    id: data.id || data._id || '',
    name: data.name || data._name || '',
    email: data.email || data._email || '',
    role: data.role || data._role || '',
    project: data.project || data._project || '',
    admissionDate: data.admissionDate || data._admissionDate || '',
    teamLeader: data.teamLeader || data._teamLeader || '',
    status: data.status || data._status || '',
    riskLevel: (riskLevel || 'NONE').toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE',
    createdAt: data.createdAt || data._createdAt || '',
    updatedAt: data.updatedAt || data._updatedAt || '',
  };
};

const collaboratorsService = {
  getAll: async () => {
    try {
      const response = await api.get<any[]>('/collaborators');
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      console.log('Response data type:', typeof response.data);
      console.log('Is array:', Array.isArray(response.data));
      
      if (!response.data) {
        console.warn('Response data is null or undefined');
        return [];
      }
      
      if (!Array.isArray(response.data)) {
        console.warn('Response data is not an array:', response.data);
        return [];
      }
      
      // Normalizar los datos para manejar campos con _ o sin _
      const normalized = response.data.map(normalizeCollaborator);
      console.log('Normalized data:', normalized);
      return normalized;
    } catch (error: any) {
      console.error('Error in getAll:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  },

  getById: async (id: string) => {
    const response = await api.get<any>(`/collaborators/${id}`);
    return normalizeCollaborator(response.data);
  },

  create: async (data: CreateCollaboratorPayload) => {
    const response = await api.post<any>('/collaborators', data);
    return normalizeCollaborator(response.data);
  },

  update: async (id: string, data: UpdateCollaboratorPayload) => {
    const response = await api.put<any>(`/collaborators/${id}`, data);
    return normalizeCollaborator(response.data);
  },

  delete: async (id: string) => {
    await api.delete(`/collaborators/${id}`);
  }
};

export default collaboratorsService;

