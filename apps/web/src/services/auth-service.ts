import axios from 'axios';
import { LoginCredentials, AuthResponse } from '../types/auth-types';

const API_URL = 'http://localhost:3000';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { data } = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
        return data;
    },

    saveToken(token: string) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('smartcondo_token', token);
        }
    }
};