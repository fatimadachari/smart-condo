'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '@/types/auth-types';

export function useAuth() {
    const router = useRouter();
    const [user, setUser] = useState<DecodedToken | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('smartcondo_token');

        console.log('🔍 useAuth - Verificando token...');
        console.log('🎟️ Token encontrado:', token ? 'SIM ✅' : 'NÃO ❌');

        if (!token) {
            console.log('❌ Nenhum token - MAS NÃO VAI REDIRECIONAR (DEBUG MODE)');
            setLoading(false);
            // COMENTADO TEMPORARIAMENTE PARA DEBUG
            // router.push('/');
            return;
        }

        try {
            const decodedRaw = jwtDecode<any>(token);
            console.log('📦 Token decodificado:', decodedRaw);

            // Verificação de Expiração
            if (decodedRaw.exp * 1000 < Date.now()) {
                console.log('⏰ Token expirado!');
                localStorage.removeItem('smartcondo_token');
                // COMENTADO TEMPORARIAMENTE PARA DEBUG
                // router.push('/');
                setLoading(false);
                return;
            }

            const userMapped: DecodedToken = {
                ...decodedRaw,
                id: decodedRaw.sub
            };

            console.log('✅ Usuário mapeado:', userMapped);
            setUser(userMapped);
        } catch (error) {
            console.error('❌ Erro ao decodificar token:', error);
            localStorage.removeItem('smartcondo_token');
            // COMENTADO TEMPORARIAMENTE PARA DEBUG
            // router.push('/');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const logout = () => {
        localStorage.removeItem('smartcondo_token');
        router.push('/');
    };

    return { user, loading, logout };
}