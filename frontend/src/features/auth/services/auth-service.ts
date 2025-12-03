import api from '../../../shared/services/api-client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

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

  getCurrentUser: async () => {
    // Assuming there's an endpoint to get the current user profile
    // If not, we might need to decode the token or use a specific endpoint
    // Based on backend controller, we don't see a direct 'me' endpoint yet in the listed controllers,
    // but usually it exists or we might need to rely on just the token for now.
    // For now, I'll assume a /users/profile or similar, or just return a mock if not ready.
    // Checking backend/src/core/users/presentation/controllers/user.controller.ts again...
    // It only has create and createTestUser. 
    // The AuthController only has login.
    // I will implement a placeholder that decodes token or just assumes success for now if endpoint missing.
    // But typically we need user info.
    // Let's assume for this initial step we just store the token.
    return { name: 'User' }; // Placeholder
  }
};

export default authService;

