'use client';

import { useEffect, useState } from 'react';
import {
    Plus,
    Search,
    CalendarCheck,
    Trash2,
    Loader2,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { bookingService, Booking } from '@/services/booking-service';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { BookingFormDialog } from '@/components/features/booking-form-dialog';

// Função auxiliar para cor do status
const getStatusBadge = (status: string) => {
    switch (status) {
        case 'CONFIRMED':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                    <CheckCircle2 className="w-3 h-3" /> Confirmado
                </span>
            );
        case 'PENDING':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                    <Clock className="w-3 h-3" /> Pendente
                </span>
            );
        case 'CANCELLED':
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">
                    <XCircle className="w-3 h-3" /> Cancelado
                </span>
            );
        default:
            return <span className="text-xs text-gray-500">{status}</span>;
    }
};

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados de Ação
    const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Filtro
    const [searchTerm, setSearchTerm] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await bookingService.getAll();
            setBookings(data);
        } catch (error) {
            console.error('Erro ao carregar reservas', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Handlers
    const handleFormSuccess = () => {
        loadData(); // Recarrega a lista
    };

    const handleInitialDelete = (id: string) => {
        setBookingToDelete(id);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!bookingToDelete) return;
        setIsProcessing(true);
        try {
            await bookingService.delete(bookingToDelete);
            setBookings(prev => prev.filter(b => b.id !== bookingToDelete));
            setIsDeleteOpen(false);
            setBookingToDelete(null);
        } catch (error) {
            alert('Erro ao cancelar reserva.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Filtragem (Por nome do usuário ou nome da área)
    const filteredBookings = bookings.filter(b => {
        // Fallback de Segurança:
        // 1. Tenta pegar b.user.name
        // 2. Se não existir, tenta b.user['nome'] (caso seu banco seja em PT)
        // 3. Se nada existir, usa string vazia "" para não dar erro no toLowerCase()
        const userName = b.user?.name || (b.user as any)?.nome || '';
        const areaName = b.commonArea?.name || '';

        return userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            areaName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gunmetal-600 flex items-center gap-2">
                        <CalendarCheck className="w-8 h-8 text-terracotta-500" />
                        Reservas e Áreas Comuns
                    </h1>
                    <p className="text-gray-500">Gerencie o agendamento de espaços do condomínio.</p>
                </div>

                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-terracotta-500 text-white px-5 py-2.5 rounded-lg hover:bg-terracotta-600 transition-colors shadow-glow font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Nova Reserva
                </button>
            </div>

            {/* Barra de Busca */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por morador ou área..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                    />
                </div>
            </div>

            {/* Tabela */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-terracotta-500 animate-spin" />
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <CalendarCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gunmetal-600">Nenhuma reserva encontrada</h3>
                    <p className="text-gray-500">Realize o primeiro agendamento.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Morador</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Área / Espaço</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data e Horário</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 transition-colors group">

                                    {/* Morador */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            {/* Tenta mostrar name, se não tiver mostra nome, se não tiver mostra "Desconhecido" */}
                                            <span className="font-medium text-gunmetal-600">
                                                {booking.user?.name || (booking.user as any)?.nome || 'Morador Desconhecido'}
                                            </span>
                                            <span className="text-xs text-gray-400">{booking.user?.email}</span>
                                        </div>
                                    </td>

                                    {/* Área Comum */}
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                                            {booking.commonArea?.name}
                                        </span>
                                    </td>

                                    {/* Data */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col text-sm text-gray-600">
                                            <span className="font-medium">
                                                {new Date(booking.date).toLocaleDateString('pt-BR')}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(booking.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                {' até '}
                                                {booking.endDate ? new Date(booking.endDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '...'}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        {getStatusBadge(booking.status)}
                                    </td>

                                    {/* Ações */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleInitialDelete(booking.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Cancelar Reserva"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modais */}
            <BookingFormDialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleFormSuccess}
            />

            <ConfirmationDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                title="Cancelar Reserva"
                description="Tem certeza que deseja cancelar este agendamento? O horário ficará livre para outros moradores."
                confirmText="Sim, cancelar"
                variant="danger"
                isLoading={isProcessing}
            />
        </div>
    );
}