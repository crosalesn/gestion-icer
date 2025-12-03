import api from '../../../shared/services/api-client';
import type { ActionPlan, AssignActionPlanPayload } from '../types/action-plan.types';

const actionPlansService = {
  getByCollaborator: async (collaboratorId: string) => {
    const response = await api.get<ActionPlan[]>(`/action-plans/collaborator/${collaboratorId}`);
    return response.data;
  },

  assign: async (collaboratorId: string, data: AssignActionPlanPayload) => {
    const response = await api.post<ActionPlan>(`/action-plans/collaborator/${collaboratorId}`, data);
    return response.data;
  }
};

export default actionPlansService;

