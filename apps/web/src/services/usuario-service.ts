import { api } from '@/lib/api';
import { Condominio, ApiResponse } from './condominio-service';

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
  unidadeId?: string | null;
  criadoEm: string;
  condominio?: Condominio; 
}

export interface CreateUsuarioDto {
  name: string;
  email: string;
  password?: string; 
  role: UserRole;
  condominioId?: string;
  unidadeId?: string;
}

export interface UpdateUsuarioDto {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  condominioId?: string;
  unidadeId?: string;
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