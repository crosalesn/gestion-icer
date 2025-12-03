import api from '../../../shared/services/api-client';
import type { CollaboratorHistory, DashboardStats } from '../types/report.types';

const reportsService = {
  getCollaboratorHistory: async (collaboratorId: string) => {
    const response = await api.get<CollaboratorHistory>(`/reports/collaborator/${collaboratorId}`);
    return response.data;
  },
  
  getDashboardStats: async () => {
      const response = await api.get<DashboardStats>('/reports/dashboard');
      return response.data;
  }
};

export default reportsService;
