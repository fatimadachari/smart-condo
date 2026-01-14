import { api } from '@/lib/api';

export enum TipoAviso {
  GERAL = 'GERAL',
  URGENTE = 'URGENTE'
}

export interface Aviso {
  id: string;
  titulo: string;
  descricao: string;
  tipo: TipoAviso; 
  criadoEm: string;
  dataEvento: string | null;
  condominioId: string;
  autorId: string;
}

export interface CreateAvisoDto {
  titulo: string;
  descricao: string;
  tipo?: TipoAviso;
  dataEvento?: string;
  condominioId?: string; 
}

export interface UpdateAvisoDto {
  titulo?: string;
  descricao?: string;
  tipo?: TipoAviso;
  dataEvento?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const avisosService = {
  getAll: async (condominioId?: string): Promise<Aviso[]> => {
    const url = condominioId ? `/avisos?condominioId=${condominioId}` : '/avisos';
    const response = await api.get<ApiResponse<Aviso[]>>(url);
    return response.data.data;
  },

  getById: async (id: string): Promise<Aviso> => {
    const response = await api.get<ApiResponse<Aviso>>(`/avisos/${id}`);
    return response.data.data;
  },

  create: async (data: CreateAvisoDto): Promise<Aviso> => {
    const response = await api.post<ApiResponse<Aviso>>('/avisos', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateAvisoDto): Promise<Aviso> => {
    const response = await api.patch<ApiResponse<Aviso>>(`/avisos/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/avisos/${id}`);
  }
};