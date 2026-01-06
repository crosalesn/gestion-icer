import api from '../../../shared/services/api-client';
import type { CreateFollowUpPlanTemplateDto, FollowUpPlanTemplate } from '../types/follow-up-plan-template';

export const followUpPlanService = {
  getTemplates: async (): Promise<FollowUpPlanTemplate[]> => {
    const response = await api.get<FollowUpPlanTemplate[]>('/follow-up-plans/templates');
    return response.data;
  },

  createTemplate: async (data: CreateFollowUpPlanTemplateDto): Promise<FollowUpPlanTemplate> => {
    const response = await api.post<FollowUpPlanTemplate>('/follow-up-plans/templates', data);
    return response.data;
  },

  updateTemplate: async (id: string, data: Partial<CreateFollowUpPlanTemplateDto>): Promise<FollowUpPlanTemplate> => {
    const response = await api.put<FollowUpPlanTemplate>(`/follow-up-plans/templates/${id}`, data);
    return response.data;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await api.delete(`/follow-up-plans/templates/${id}`);
  },
};

