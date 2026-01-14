import { api } from '@/lib/api';
import { Condominio, ApiResponse } from './condominio-service';

export interface Unidade {
  id: string;
  identificacao: string; 
  bloco: string | null;
  condominioId: string;
  condominio?: Condominio;
}

export interface CreateUnidadeDto {
  identificacao: string;
  bloco?: string;
  condominioId: string;
}

export interface UpdateUnidadeDto {
  identificacao?: string;
  bloco?: string;
  condominioId?: string;
}

export const unidadeService = {
  getAll: async (): Promise<Unidade[]> => {
    const response = await api.get<ApiResponse<Unidade[]>>('/unidades');
    return response.data.data;
  },

  getById: async (id: string): Promise<Unidade> => {
    const response = await api.get<ApiResponse<Unidade>>(`/unidades/${id}`);
    return response.data.data;
  },

  create: async (data: CreateUnidadeDto): Promise<Unidade> => {
    const response = await api.post<ApiResponse<Unidade>>('/unidades', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateUnidadeDto): Promise<Unidade> => {
    const response = await api.patch<ApiResponse<Unidade>>(`/unidades/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/unidades/${id}`);
  }
};