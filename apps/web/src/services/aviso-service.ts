import { api } from '@/lib/api';

export enum TipoAviso {
    GERAL = 'GERAL',
    URGENTE = 'URGENTE'
}

export interface Aviso {
    id: string;
    titulo: string;
    descricao: string;
    tipo: 'GERAL' | 'URGENTE';
    dataEvento?: string;
    criadoEm: string;
}

export interface CreateAvisoDto {
    titulo: string;
    descricao: string;
    tipo?: 'GERAL' | 'URGENTE';
    dataEvento?: string;
}

export const avisosService = {
    getAll: async () => {
        const response = await api.get<Aviso[]>('/avisos');
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/avisos/${id}`);
    },

    create: async (data: CreateAvisoDto) => {
        const response = await api.post<Aviso>('/avisos', data);
        return response.data;
    },

    update: async (id: string, data: CreateAvisoDto) => {
        const response = await api.patch<Aviso>(`/avisos/${id}`, data);
        return response.data;
    }
};