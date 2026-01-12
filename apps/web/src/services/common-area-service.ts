import { api } from '@/lib/api';

export interface CommonArea {
    id: string;
    name: string;
    description?: string;
    capacity: number;
    isActive: boolean;
}

export interface CreateCommonAreaDto {
    name: string;
    description?: string;
    capacity: number;
    isActive?: boolean;
}

export const commonAreaService = {
    getAll: async () => {
        const response = await api.get<CommonArea[]>('/common-areas');
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await api.get<CommonArea>(`/common-areas/${id}`);
        return response.data;
    },

    create: async (data: CreateCommonAreaDto) => {
        const response = await api.post<CommonArea>('/common-areas', data);
        return response.data;
    },

    update: async (id: string, data: CreateCommonAreaDto) => {
        const response = await api.patch<CommonArea>(`/common-areas/${id}`, data);
        return response.data;
    },

    delete: async (id: string, force: boolean = false) => {
        await api.delete(`/common-areas/${id}?force=${force}`);
    }
};