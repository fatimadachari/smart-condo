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

export interface UpdateCondominioDto {
  nome?: string;
  endereco?: string;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface GetAllCondominiosParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export const condominioService = {
  getAll: async (params?: GetAllCondominiosParams): Promise<PaginatedResponse<Condominio>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.perPage) queryParams.append('perPage', params.perPage.toString());
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const url = `/condominios${queryString ? `?${queryString}` : ''}`;

    const response = await api.get<ApiResponse<PaginatedResponse<Condominio>>>(url);
    
    return response.data.data;
  },

  getById: async (id: string): Promise<Condominio> => {
    const response = await api.get<ApiResponse<Condominio>>(`/condominios/${id}`);
    return response.data.data;
  },

  create: async (data: CreateCondominioDto): Promise<Condominio> => {
    const response = await api.post<ApiResponse<Condominio>>('/condominios', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateCondominioDto): Promise<Condominio> => {
    const response = await api.patch<ApiResponse<Condominio>>(`/condominios/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string, force: boolean = false): Promise<void> => {
    const url = `/condominios/${id}${force ? '?force=true' : ''}`;
    await api.delete(url);
  }
};