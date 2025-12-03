export enum UserRole {
  COLLABORATOR = 'COLLABORATOR',
  TEAM_LEADER = 'TEAM_LEADER',
  SPECIALIST = 'SPECIALIST',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

