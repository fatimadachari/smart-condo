import { api } from '@/lib/api';

export interface Condominio {
    id: string;
    nome: string;
    endereco: string | null;
    criadoEm: string;
}

export interface CreateCondominioDto {
    nome: string;
    endereco?: string;
}

export const condominioService = {
    getAll: async () => {
        const response = await api.get<Condominio[]>('/condominios');
        return response.data;
    },

    delete: async (id: string, force: boolean = false) => {
        const url = `/condominios/${id}${force ? '?force=true' : ''}`;
        await api.delete(url);
    },

    create: async (data: CreateCondominioDto) => {
        const response = await api.post<Condominio>('/condominios', data);
        return response.data;
    },

    update: async (id: string, data: CreateCondominioDto) => {
        const response = await api.patch<Condominio>(`/condominios/${id}`, data);
        return response.data;
    }
};