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
            router.push('/'); // Chuta para o login se não tiver token
            return;
        }

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            // Opcional: Verificar se o token expirou (exp < Date.now() / 1000)
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem('smartcondo_token');
                router.push('/');
                return;
            }

            setUser(decoded);
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