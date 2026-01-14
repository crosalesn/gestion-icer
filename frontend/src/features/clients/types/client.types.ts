export interface Client {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientPayload {
  name: string;
}

export interface UpdateClientPayload {
  name: string;
}
