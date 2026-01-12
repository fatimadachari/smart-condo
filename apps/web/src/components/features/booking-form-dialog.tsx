'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { X, Loader2, Calendar, Clock } from 'lucide-react';
import { bookingService, CreateBookingDto } from '@/services/booking-service';
import { commonAreaService, CommonArea } from '@/services/common-area-service';
import { useAuth } from '@/hooks/use-auth'; // Supondo que você tenha isso para pegar o ID do user logado

interface BookingFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function BookingFormDialog({
    isOpen,
    onClose,
    onSuccess,
}: BookingFormDialogProps) {
    const { user } = useAuth(); // Pegar ID do usuário logado
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Estado para armazenar as áreas comuns carregadas da API
    const [areas, setAreas] = useState<CommonArea[]>([]);
    const [loadingAreas, setLoadingAreas] = useState(true);
    
    const { register, handleSubmit, reset, watch, setValue } = useForm<CreateBookingDto>();

    // Carregar áreas comuns ao abrir
    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            loadAreas();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            reset();
        }
        return () => setMounted(false);
    }, [isOpen]);

    const loadAreas = async () => {
        try {
            setLoadingAreas(true);
            const data = await commonAreaService.getAll();
            setAreas(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingAreas(false);
        }
    };

    const onSubmit = async (data: CreateBookingDto) => {
        if (!user?.id) {
            alert('Erro: Usuário não identificado.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Conversão de data do input HTML para ISO string
            const payload = {
                ...data,
                userId: user.id, // Injeta o ID do usuário logado
                date: new Date(data.date).toISOString(),
                endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined
            };

            await bookingService.create(payload);
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            // Tratamento simples do erro de conflito (409)
            if (err.response?.status === 409) {
                alert('Conflito! Já existe uma reserva para este horário.');
            } else {
                alert('Erro ao realizar reserva.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-700">Nova Reserva</h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" /></button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 overflow-y-auto">
                    
                    {/* SELEÇÃO DE ÁREA */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Área Comum</label>
                        {loadingAreas ? (
                            <div className="animate-pulse h-10 bg-gray-100 rounded-lg" />
                        ) : (
                            <select 
                                {...register('commonAreaId', { required: true })} 
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-terracotta-500 outline-none bg-white"
                            >
                                <option value="">Selecione uma área...</option>
                                {areas.map(area => (
                                    <option key={area.id} value={area.id}>
                                        {area.name} (Cap: {area.capacity})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* DATA INICIO */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Início da Reserva</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input 
                                type="datetime-local" 
                                {...register('date', { required: true })} 
                                className="w-full border border-gray-300 rounded-lg p-2 pl-10 focus:ring-2 focus:ring-terracotta-500 outline-none" 
                            />
                        </div>
                    </div>

                    {/* DATA FIM */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fim da Reserva (Opcional)</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input 
                                type="datetime-local" 
                                {...register('endDate')} 
                                className="w-full border border-gray-300 rounded-lg p-2 pl-10 focus:ring-2 focus:ring-terracotta-500 outline-none" 
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Se deixar em branco, será agendado por 1 hora.</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-600">Cancelar</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-lg flex items-center gap-2 font-medium shadow-lg shadow-terracotta-500/20">
                            {isSubmitting && <Loader2 className="animate-spin w-4 h-4" />}
                            Confirmar Reserva
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}