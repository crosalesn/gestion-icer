export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: string;
  project: string;
  admissionDate: string;
  teamLeader: string;
  clientId: string;
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
  clientId: string;
}

export interface UpdateCollaboratorPayload {
  name: string;
  email: string;
  role: string;
  project: string;
  admissionDate: string;
  teamLeader: string;
  clientId: string;
}
