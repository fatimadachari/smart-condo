import { api } from '@/lib/api';
import { Condominio } from './condominio-service';

export interface Usuario {
    id: string;
    nome: string;
    email: string;
    tipo: string; // "SINDICO", "MORADOR", "PORTEIRO"
    condominioId: string;
    unidadeId: string | null;
    criadoEm: string;
    condominio?: Condominio;
}

export interface CreateUsuarioDto {
    nome: string;
    email: string;
    senha: string;
    tipo: string;
    condominioId: string;
    unidadeId?: string;
}

export interface UpdateUsuarioDto {
    nome?: string;
    email?: string;
    senha?: string;
    tipo?: string;
    condominioId?: string;
    unidadeId?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
}

export const usuarioService = {
    getAll: async (): Promise<Usuario[]> => {
        const response = await api.get<ApiResponse<Usuario[]>>('/users');
        return response.data.data;
    },

    getById: async (id: string): Promise<Usuario> => {
        const response = await api.get<ApiResponse<Usuario>>(`/users/${id}`);
        return response.data.data;
    },

    create: async (data: CreateUsuarioDto): Promise<Usuario> => {
        const response = await api.post<ApiResponse<Usuario>>('/users', data);
        return response.data.data;
    },

    update: async (id: string, data: UpdateUsuarioDto): Promise<Usuario> => {
        const response = await api.patch<ApiResponse<Usuario>>(`/users/${id}`, data);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/users/${id}`);
    }
};