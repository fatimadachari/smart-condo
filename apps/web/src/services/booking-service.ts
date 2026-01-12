import { api } from '@/lib/api';
import { CommonArea } from './common-area-service';

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    REJECTED = 'REJECTED'
}

export interface Booking {
    id: string;
    date: string;    // Data Inicio
    endDate: string; // Data Fim
    status: BookingStatus;
    user: {
        name?: string; // Pode vir name
        nome?: string; // Pode vir nome
        email: string;
    };
    commonArea: CommonArea;
}

export interface CreateBookingDto {
    commonAreaId: string;
    userId: string; // Em um app real, o backend pegaria do token, mas vamos mandar por enquanto se sua API exigir
    date: string;
    endDate?: string;
}

export const bookingService = {
    getAll: async () => {
        const response = await api.get<Booking[]>('/bookings');
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/bookings/${id}`);
    },

    create: async (data: CreateBookingDto) => {
        const response = await api.post<Booking>('/bookings', data);
        return response.data;
    },

    // Método para aprovar/rejeitar (opcional por enquanto)
    updateStatus: async (id: string, status: BookingStatus) => {
        const response = await api.patch<Booking>(`/bookings/${id}`, { status });
        return response.data;
    }
};