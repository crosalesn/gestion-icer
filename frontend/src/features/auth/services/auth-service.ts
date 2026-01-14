import api from '../../../shared/services/api-client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface TokenPayload {
  sub: number;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Decodifica el payload del JWT (sin verificar la firma)
const decodeToken = (token: string): TokenPayload | null => {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch {
    return null;
  }
};

const authService = {
  login: async (credentials: LoginPayload) => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  decodeToken,

  getUserFromToken: (): { id: number; name: string; email: string; role: string } | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const payload = decodeToken(token);
    if (!payload) return null;
    
    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
  },
};

export default authService;

