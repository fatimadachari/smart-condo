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

        if (!token) {
            router.push('/');
            return;
        }

        try {
            // Decodificamos o payload bruto
            const decodedRaw = jwtDecode<any>(token);

            // Verificação de Expiração
            if (decodedRaw.exp * 1000 < Date.now()) {
                localStorage.removeItem('smartcondo_token');
                router.push('/');
                return;
            }

            // Mapeamos o 'sub' (padrão JWT) para 'id' (padrão da nossa App)
            const userMapped: DecodedToken = {
                ...decodedRaw,
                id: decodedRaw.sub // O pulo do gato!
            };

            setUser(userMapped);
        } catch (error) {
            localStorage.removeItem('smartcondo_token');
            router.push('/');
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