import { api } from '@/lib/api';
import { Condominio } from './condominio-service';

export interface Unidade {
    id: string;
    bloco: string | null;
    numero: string;
    condominioId: string;
    condominio?: Condominio;
}

export interface CreateUnidadeDto {
    bloco?: string;
    numero: string;
    condominioId: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
}

export const unidadeService = {
    getAll: async (): Promise<Unidade[]> => {
        const response = await api.get<ApiResponse<Unidade[]>>('/unidades');
        return response.data.data;
    },

    create: async (data: CreateUnidadeDto): Promise<Unidade> => {
        const response = await api.post<ApiResponse<Unidade>>('/unidades', data);
        return response.data.data;
    },

    update: async (id: string, data: CreateUnidadeDto): Promise<Unidade> => {
        const response = await api.patch<ApiResponse<Unidade>>(`/unidades/${id}`, data);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/unidades/${id}`);
    }
};