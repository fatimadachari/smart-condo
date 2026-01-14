import { api } from '@/lib/api';
import { CommonArea } from './common-area-service';
import { Usuario } from './usuario-service';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED'
}

export interface Booking {
  id: string;
  date: string; 
  endDate: string | null; 
  status: BookingStatus;
  userId: string;
  commonAreaId: string;
  createdAt: string;
  updatedAt: string;
  user?: Usuario;
  commonArea?: CommonArea;
}

export interface CreateBookingDto {
  commonAreaId: string;
  userId: string;
  date: string; 
  endDate?: string; 
}

export interface UpdateBookingDto {
  status?: BookingStatus;
  date?: string;
  endDate?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export const bookingService = {
  getAll: async (): Promise<Booking[]> => {
    const response = await api.get<ApiResponse<Booking[]>>('/bookings');
    return response.data.data;
  },

  getById: async (id: string): Promise<Booking> => {
    const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data.data;
  },

  create: async (data: CreateBookingDto): Promise<Booking> => {
    const response = await api.post<ApiResponse<Booking>>('/bookings', data);
    return response.data.data;
  },

  updateStatus: async (id: string, status: BookingStatus): Promise<Booking> => {
    const response = await api.patch<ApiResponse<Booking>>(`/bookings/${id}`, { status });
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/bookings/${id}`);
  }
};