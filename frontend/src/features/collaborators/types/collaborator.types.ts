export interface Collaborator {
  id: number;
  name: string;
  email: string;
  role: string;
  project: string;
  admissionDate: string;
  teamLeader: string;
  clientId: number;
  status: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollaboratorPayload {
  name: string;
  email: string;
  role: string;
  project: string;
  admissionDate: string;
  teamLeader: string;
  clientId: number;
}

export interface UpdateCollaboratorPayload {
  name: string;
  email: string;
  role: string;
  project: string;
  admissionDate: string;
  teamLeader: string;
  clientId: number;
}
