import api from '../../../shared/services/api-client';
import type { EvaluationTemplate } from '../types/template.types';

interface CreateTemplatePayload {
  title: string;
  milestone: string;
  targetRole: string;
  description?: string;
  questions: Array<{
    text: string;
    dimensionId: string;
    type: string;
    order: number;
    required: boolean;
  }>;
}

interface UpdateTemplatePayload {
  title?: string;
  description?: string;
  isActive?: boolean;
  questions?: Array<{
    id?: string;
    text: string;
    dimensionId: string;
    type: string;
    order: number;
    required: boolean;
  }>;
}

const templateService = {
  getAll: async (): Promise<EvaluationTemplate[]> => {
    const response = await api.get<EvaluationTemplate[]>('/evaluations/templates');
    return response.data;
  },

  getById: async (id: number | string): Promise<EvaluationTemplate> => {
    const response = await api.get<EvaluationTemplate>(`/evaluations/templates/${id}`);
    return response.data;
  },

  create: async (payload: CreateTemplatePayload): Promise<EvaluationTemplate> => {
    const response = await api.post<EvaluationTemplate>('/evaluations/templates', payload);
    return response.data;
  },

  update: async (id: number | string, payload: UpdateTemplatePayload): Promise<EvaluationTemplate> => {
    const response = await api.put<EvaluationTemplate>(`/evaluations/templates/${id}`, payload);
    return response.data;
  }
};

export default templateService;

