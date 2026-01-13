import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de Requisição
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('smartcondo_token') : null;

        console.log('🔑 Token encontrado:', token ? 'SIM ✅' : 'NÃO ❌');
        console.log('📍 Requisição para:', config.url);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Token adicionado no header');
        } else {
            console.log('❌ Nenhum token para adicionar');
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de Resposta
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log('❌ Erro na resposta:', error.response?.status, error.response?.data);
        
        if (error.response?.status === 401) {
            console.log('🚪 401 detectado - Removendo token e redirecionando');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('smartcondo_token');
                
                // Só redireciona se não estiver já na página de login
                if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
                    window.location.href = '/';
                }
            }
        }
        
        return Promise.reject(error);
    }
);