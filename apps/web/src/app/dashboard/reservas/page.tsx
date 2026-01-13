'use client';

import { useEffect, useState } from 'react';
import {
    Plus,
    Calendar as CalendarIcon,
    Trash2,
    Loader2,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronLeft,
    ChevronRight,
    MapPin,
    User
} from 'lucide-react';
import { bookingService, Booking } from '@/services/booking-service';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { BookingFormDialog } from '@/components/features/booking-form-dialog';

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados do Calendário
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Estados de Ação
    const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

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

    // --- LÓGICA DO CALENDÁRIO ---
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
        setCurrentDate(newDate);
    };

    const isSameDay = (date1: Date, date2: Date) => {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    };

    // Filtra reservas do dia selecionado para a Sidebar
    const selectedDayBookings = bookings.filter(b => isSameDay(new Date(b.date), selectedDate));

    // Renderização dos dias do mês
    const renderCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        
        const days = [];
        // Preencher dias vazios antes do início do mês
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 md:h-28" />);
        }

        // Preencher dias do mês
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            
            // Reservas neste dia
            const dayBookings = bookings.filter(b => isSameDay(new Date(b.date), date));
            const hasBookings = dayBookings.length > 0;

            days.push(
                <div 
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className={`
                        relative h-24 md:h-28 border border-stone-100 p-2 cursor-pointer transition-all duration-200
                        hover:bg-stone-50 hover:shadow-inner
                        ${isSelected ? 'bg-clay-50 ring-2 ring-inset ring-clay-200 z-10' : 'bg-white'}
                        ${isToday ? 'bg-stone-50' : ''}
                    `}
                >
                    <div className="flex justify-between items-start">
                        <span className={`
                            text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                            ${isToday ? 'bg-espresso-800 text-white' : isSelected ? 'text-clay-700 font-bold' : 'text-stone-500'}
                        `}>
                            {day}
                        </span>
                    </div>

                    {/* Indicadores de Reserva (Pontinhos) */}
                    <div className="mt-2 flex flex-wrap gap-1 content-start">
                        {dayBookings.slice(0, 4).map((b, idx) => {
                            const color = b.status === 'CONFIRMED' ? 'bg-green-400' : 
                                          b.status === 'PENDING' ? 'bg-yellow-400' : 'bg-stone-300';
                            return (
                                <div key={idx} className={`w-2 h-2 rounded-full ${color}`} title={b.commonArea?.name} />
                            );
                        })}
                        {dayBookings.length > 4 && (
                            <span className="text-[10px] text-stone-400 pl-0.5">+</span>
                        )}
                    </div>
                </div>
            );
        }
        return days;
    };

    // --- AÇÕES ---
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
        } catch (error) {
            alert('Erro ao cancelar reserva.');
        } finally {
            setIsProcessing(false);
        }
    };

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    return (
        <div className="animate-in fade-in duration-500 h-[calc(100vh-140px)] flex flex-col">
            
            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-6">
                    <h1 className="text-3xl font-light text-espresso-900 tracking-tight">
                        Agenda de <span className="font-semibold">Reservas</span>
                    </h1>
                    
                    {/* Navegação de Mês */}
                    <div className="flex items-center gap-2 bg-white rounded-full border border-stone-200 p-1 shadow-sm">
                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-stone-100 rounded-full text-stone-500 hover:text-espresso-800 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="w-40 text-center font-medium text-espresso-800">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-stone-100 rounded-full text-stone-500 hover:text-espresso-800 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-espresso-800 hover:bg-espresso-900 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-stone-200 hover:shadow-xl hover:-translate-y-0.5 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="font-medium tracking-wide">Nova Reserva</span>
                </button>
            </div>

            {/* Layout Principal: Calendário + Sidebar */}
            <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
                
                {/* CALENDÁRIO (Esquerda) */}
                <div className="flex-1 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
                    {/* Dias da Semana Header */}
                    <div className="grid grid-cols-7 border-b border-stone-100 bg-stone-50/50">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                            <div key={day} className="py-3 text-center text-xs font-bold text-stone-400 uppercase tracking-widest">
                                {day}
                            </div>
                        ))}
                    </div>
                    
                    {/* Grid de Dias */}
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <Loader2 className="w-10 h-10 text-clay-400 animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-7 flex-1 overflow-y-auto custom-scrollbar">
                            {renderCalendarDays()}
                        </div>
                    )}
                </div>

                {/* SIDEBAR DO DIA (Direita) */}
                <div className="w-full lg:w-96 bg-white rounded-2xl border border-stone-200 shadow-xl shadow-stone-200/50 flex flex-col overflow-hidden">
                    {/* Cabeçalho do Dia */}
                    <div className="p-6 border-b border-stone-100 bg-espresso-900 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-clay-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10" />
                        <h2 className="text-4xl font-light relative z-10">{selectedDate.getDate()}</h2>
                        <p className="text-clay-200 font-medium uppercase tracking-widest text-sm relative z-10">
                            {monthNames[selectedDate.getMonth()]} • {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
                        </p>
                    </div>

                    {/* Lista de Reservas do Dia */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50/30">
                        {selectedDayBookings.length === 0 ? (
                            <div className="text-center py-10 opacity-60">
                                <CalendarIcon className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                                <p className="text-stone-500 font-medium">Sem agendamentos</p>
                                <p className="text-xs text-stone-400">Este dia está livre.</p>
                            </div>
                        ) : (
                            selectedDayBookings.map(booking => (
                                <div key={booking.id} className="group bg-white p-4 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-all hover:border-clay-200 relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-clay-600 uppercase tracking-widest flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {booking.commonArea?.name}
                                        </span>
                                        {/* Status Dot */}
                                        <div className={`w-2 h-2 rounded-full ${
                                            booking.status === 'CONFIRMED' ? 'bg-green-500' :
                                            booking.status === 'PENDING' ? 'bg-yellow-500' : 'bg-stone-300'
                                        }`} />
                                    </div>
                                    
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-espresso-900 leading-tight">
                                                {booking.user?.name || 'Usuário'}
                                            </p>
                                            <p className="text-[10px] text-stone-400">Morador</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 p-2 rounded-lg">
                                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                                        {new Date(booking.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                                        {' - '}
                                        {booking.endDate ? new Date(booking.endDate).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : '...'}
                                    </div>

                                    {/* Botão de Excluir (Só aparece no Hover) */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleInitialDelete(booking.id); }}
                                        className="absolute top-2 right-2 p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-4 border-t border-stone-200 bg-white">
                        <div className="flex justify-between text-[10px] text-stone-400 uppercase tracking-wider font-medium">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-400 rounded-full" /> Confirmado</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-400 rounded-full" /> Pendente</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-stone-300 rounded-full" /> Cancelado</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modais */}
            <BookingFormDialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={loadData}
                // Pre-seleciona a data clicada no calendário para facilitar
                initialDate={selectedDate} 
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