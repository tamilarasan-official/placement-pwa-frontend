import api from './api';
import { AuthResponse } from '../types';

export const authService = {
  async register(
    name: string,
    email: string,
    password: string,
    department: string,
    roll_number: string
  ): Promise<AuthResponse> {
    const { data } = await api.post('/auth/register', {
      name,
      email,
      password,
      department,
      roll_number,
    });
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  async getMe(): Promise<AuthResponse> {
    const { data } = await api.get('/auth/me');
    return data;
  },
};
