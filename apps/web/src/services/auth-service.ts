import axios from 'axios';
import { LoginCredentials, AuthPayload, ApiResponse } from '../types/auth-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export const TOKEN_KEY = 'smartcondo_token';

const isBrowser = typeof window !== 'undefined';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthPayload> => {
    const response = await axios.post<ApiResponse<AuthPayload>>(`${API_URL}/auth/login`, credentials);
    
    console.log('API Raw Response:', response.data);

    return response.data.data; 
  },

  saveToken: (token: string): void => {
    if (isBrowser) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  getToken: (): string | null => {
    if (isBrowser) {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  removeToken: (): void => {
    if (isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  isAuthenticated: (): boolean => {
    if (!isBrowser) return false;
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  }
};