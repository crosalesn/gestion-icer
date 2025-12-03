import api from '../../../shared/services/api-client';
import type { Evaluation, CreateEvaluationPayload, SubmitEvaluationPayload } from '../types/evaluation.types';
import type { 
  PendingEvaluationResponse, 
  SubmitAssignmentPayload,
  EvaluationTemplate,
  EvaluationAssignment,
  CompletedAssignmentResponse,
} from '../types/template.types';
import type { EvaluationMilestone } from '../types/template.types';
import type { MilestoneResult } from '../types/milestone-result.types';

const evaluationsService = {
  // ==========================================
  // DEPRECATED - Old evaluation system
  // ==========================================
  // Use assignEvaluation + submitAssignment instead
  
  /**
   * @deprecated Use assignEvaluation instead
   */
  create: async (data: CreateEvaluationPayload) => {
    const response = await api.post<Evaluation>('/evaluations', data);
    return response.data;
  },

  /**
   * @deprecated Use submitAssignment instead
   */
  submit: async (id: string, data: SubmitEvaluationPayload) => {
    const response = await api.post<Evaluation>(`/evaluations/${id}/submit`, data);
    return response.data;
  },

  /**
   * @deprecated Legacy endpoint
   */
  getById: async (id: string) => {
    const response = await api.get<Evaluation>(`/evaluations/${id}`);
    return response.data;
  },
  
  /**
   * @deprecated Legacy endpoint
   */
  getByCollaborator: async (collaboratorId: string) => {
    const response = await api.get<Evaluation[]>(`/evaluations/collaborator/${collaboratorId}`);
    return response.data;
  },

  // ==========================================
  // NEW TEMPLATE-BASED EVALUATION SYSTEM
  // ==========================================

  // ==========================================
  // NEW TEMPLATE-BASED EVALUATION SYSTEM
  // ==========================================
  
  getAllPending: async (): Promise<PendingEvaluationResponse[]> => {
    const response = await api.get<PendingEvaluationResponse[]>('/evaluations/pending');
    return response.data;
  },

  submitAssignment: async (assignmentId: string, data: SubmitAssignmentPayload): Promise<EvaluationAssignment> => {
    const response = await api.post<EvaluationAssignment>(
      `/evaluations/assignments/${assignmentId}/submit`,
      data
    );
    return response.data;
  },

  assignEvaluation: async (collaboratorId: string, milestone: EvaluationMilestone): Promise<EvaluationAssignment[]> => {
    const response = await api.post<EvaluationAssignment[]>('/evaluations/assign', {
      collaboratorId,
      milestone,
    });
    return response.data;
  },

  /**
   * Get consolidated milestone results for a collaborator
   */
  getCollaboratorResults: async (collaboratorId: string): Promise<MilestoneResult[]> => {
    const response = await api.get<MilestoneResult[]>(`/evaluations/collaborators/${collaboratorId}/results`);
    return response.data;
  },

  /**
   * Get completed evaluation assignments with answers for a collaborator
   */
  getCollaboratorCompletedAssignments: async (collaboratorId: string): Promise<CompletedAssignmentResponse[]> => {
    const response = await api.get<CompletedAssignmentResponse[]>(`/evaluations/collaborators/${collaboratorId}/completed-assignments`);
    return response.data;
  },

  // Template administration
  getAllTemplates: async (): Promise<EvaluationTemplate[]> => {
    const response = await api.get<EvaluationTemplate[]>('/evaluations/templates');
    return response.data;
  },

  createTemplate: async (template: Partial<EvaluationTemplate>): Promise<EvaluationTemplate> => {
    const response = await api.post<EvaluationTemplate>('/evaluations/templates', template);
    return response.data;
  },

  updateTemplate: async (templateId: string, template: Partial<EvaluationTemplate>): Promise<EvaluationTemplate> => {
    const response = await api.put<EvaluationTemplate>(`/evaluations/templates/${templateId}`, template);
    return response.data;
  },

  seedTemplates: async () => {
    const response = await api.post('/evaluations/templates/seed');
    return response.data;
  },
};

export default evaluationsService;
