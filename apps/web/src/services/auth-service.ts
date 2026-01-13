import axios from 'axios';
import { LoginCredentials, AuthResponse } from '../types/auth-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const TOKEN_KEY = 'smartcondo_token';

interface ApiAuthResponse {
    success: boolean;
    data: AuthResponse;
    timestamp: string;
}

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const { data } = await axios.post<ApiAuthResponse>(`${API_URL}/auth/login`, credentials);
        return data.data; // Acessa data.data porque o backend envelopa
    },

    saveToken: (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, token);
        }
    },

    getToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(TOKEN_KEY);
        }
        return null;
    },

    removeToken: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY);
        }
    }
};