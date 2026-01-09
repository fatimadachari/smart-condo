import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // URL da sua API NestJS
});

// Interceptor de Requisição: Antes de sair, coloca o crachá (Token)
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('smartcondo_token') : null;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Interceptor de Resposta: Se der erro 401, chuta pra fora
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('smartcondo_token');
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export { api };