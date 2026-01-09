import { api } from '@/lib/api';
import { Condominio } from './condominio-service';

export enum UserRole {
    ADMIN = 'ADMIN',
    SINDICO = 'SINDICO',
    PORTEIRO = 'PORTEIRO',
    MORADOR = 'MORADOR',
}

export interface Usuario {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    condominioId?: string;
    condominio?: Condominio;
}

export interface CreateUsuarioDto {
    name: string;
    email: string;
    password?: string; // Obrigatório no create, opcional no update
    role: UserRole;
    condominioId?: string;
}

export const usuarioService = {
    getAll: async () => {
        const response = await api.get<Usuario[]>('/users');
        return response.data;
    },

    create: async (data: CreateUsuarioDto) => {
        const response = await api.post<Usuario>('/users', data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateUsuarioDto>) => {
        const response = await api.patch<Usuario>(`/users/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/users/${id}`);
    }
};