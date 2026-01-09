import { api } from '@/lib/api';
import { Condominio } from './condominio-service';

export interface Unidade {
    id: string;
    identificacao: string; // Ex: "101", "102-B"
    bloco?: string;
    condominioId: string;
    condominio?: Condominio; // O objeto que pedimos no include do backend
}

export interface CreateUnidadeDto {
    identificacao: string;
    bloco?: string;
    condominioId: string;
}

export const unidadeService = {
    getAll: async () => {
        const response = await api.get<Unidade[]>('/unidades');
        return response.data;
    },

    create: async (data: CreateUnidadeDto) => {
        const response = await api.post<Unidade>('/unidades', data);
        return response.data;
    },

    update: async (id: string, data: CreateUnidadeDto) => {
        const response = await api.patch<Unidade>(`/unidades/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/unidades/${id}`);
    }
};