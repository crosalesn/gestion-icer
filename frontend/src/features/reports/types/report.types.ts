export interface Evaluation {
  id: number;
  type: 'DAY_1' | 'WEEK_1' | 'MONTH_1';
  score: number | null;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
  completedAt: string | null;
}

export interface ActionPlan {
  id: number;
  type: 'PD_30' | 'PDF_30' | 'SE_60';
  description: string;
  dueDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface CollaboratorHistory {
  collaborator: {
    id: number;
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
    id: number;
    name: string;
    project: string;
    riskLevel: string;
    admissionDate: string;
  }>;
}
