'use client';

import { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { authService, TOKEN_KEY } from '@/services/auth-service';
import { User } from '@/types/auth-types';

interface JWTPayload {
  sub: string;
  email: string;
  name: string; 
  nome?: string;
  role: string;
  tipo?: string;
  condominioId?: string;
  unidadeId?: string;
  exp: number;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    authService.removeToken();
    setUser(null);
    router.push('/');
  }, [router]);

  useEffect(() => {
    const token = authService.getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        logout();
        return;
      }

      const userMapped: User = {
        id: decoded.sub,
        name: decoded.name || decoded.nome || 'Usuário',
        email: decoded.email,
        role: decoded.role || decoded.tipo || 'MORADOR',
        condominioId: decoded.condominioId,
        unidadeId: decoded.unidadeId
      };

      setUser(userMapped);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  return { user, loading, logout };
}