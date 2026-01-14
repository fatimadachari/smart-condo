import { api } from '@/lib/api';

export interface CommonArea {
  id: string;
  name: string;
  description: string | null;
  capacity: number | null;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommonAreaDto {
  name: string;
  description?: string;
  capacity?: number;
  photoUrl?: string;
  isActive?: boolean;
}

export interface UpdateCommonAreaDto extends Partial<CreateCommonAreaDto> {}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const commonAreaService = {
  getAll: async (): Promise<CommonArea[]> => {
    const response = await api.get<ApiResponse<CommonArea[]>>('/common-areas');
    return response.data.data;
  },

  getById: async (id: string): Promise<CommonArea> => {
    const response = await api.get<ApiResponse<CommonArea>>(`/common-areas/${id}`);
    return response.data.data;
  },

  create: async (data: CreateCommonAreaDto): Promise<CommonArea> => {
    const payload = { ...data, capacity: data.capacity ? Number(data.capacity) : undefined };
    const response = await api.post<ApiResponse<CommonArea>>('/common-areas', payload);
    return response.data.data;
  },

  update: async (id: string, data: UpdateCommonAreaDto): Promise<CommonArea> => {
    const payload = { ...data, capacity: data.capacity ? Number(data.capacity) : undefined };
    const response = await api.patch<ApiResponse<CommonArea>>(`/common-areas/${id}`, payload);
    return response.data.data;
  },

  delete: async (id: string, force: boolean = false): Promise<void> => {
    const url = `/common-areas/${id}${force ? '?force=true' : ''}`;
    await api.delete(url);
  }
};