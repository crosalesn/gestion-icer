export interface Evaluation {
  id: string;
  type: 'DAY_1' | 'WEEK_1_COLLABORATOR' | 'WEEK_1_LEADER' | 'MONTH_1_COLLABORATOR' | 'MONTH_1_LEADER';
  score: number | null;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
  completedAt?: string;
}

export interface ActionPlan {
  id: string;
  type: 'PD_30' | 'PDF_30' | 'SE_60';
  description: string;
  dueDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface CollaboratorHistory {
  collaborator: {
    id: string;
    name: string;
    role: string;
    project: string;
    admissionDate: string;
    riskLevel: string;
    status: string;
  };
  evaluations: Evaluation[];
  activeActionPlan: ActionPlan | null;
}

export interface DashboardStats {
  totalCollaborators: number;
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
    none: number;
  };
  highRiskCollaborators: Array<{
    id: string;
    name: string;
    project: string;
    riskLevel: string;
    admissionDate: string;
  }>;
}
