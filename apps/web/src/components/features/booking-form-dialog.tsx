'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { X, Loader2, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { bookingService, CreateBookingDto } from '@/services/booking-service';
import { commonAreaService, CommonArea } from '@/services/common-area-service';
import { useAuth } from '@/hooks/use-auth';
import { AxiosError } from 'axios';

interface BookingFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: Date; 
}

export function BookingFormDialog({
  isOpen,
  onClose,
  onSuccess,
  initialDate
}: BookingFormDialogProps) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [areas, setAreas] = useState<CommonArea[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateBookingDto>();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const toLocalISOString = (date: Date) => {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes());
  };

  useEffect(() => {
    if (isOpen) {
      loadAreas();
      document.body.style.overflow = 'hidden';
      
      if (initialDate) {
        const defaultTime = new Date(initialDate);
        if (defaultTime.getHours() === 0 && defaultTime.getMinutes() === 0) {
            defaultTime.setHours(9, 0, 0, 0); 
        }
        setValue('date', toLocalISOString(defaultTime));
      } else {
        setValue('date', toLocalISOString(new Date()));
      }
      
      setError(null);
    } else {
      document.body.style.overflow = 'unset';
      reset();
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, initialDate, setValue, reset]);

  const loadAreas = async () => {
    try {
      setLoadingAreas(true);
      const data = await commonAreaService.getAll();
      setAreas(data.filter(a => a.isActive)); 
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar áreas comuns.');
    } finally {
      setLoadingAreas(false);
    }
  };

  const onSubmit = async (data: CreateBookingDto) => {
    if (!user?.id) {
      setError('Erro de autenticação. Faça login novamente.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...data,
        userId: user.id,
        date: new Date(data.date).toISOString(),
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined
      };

      await bookingService.create(payload);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          setError('Horário indisponível! Já existe uma reserva neste período.');
        } else if (err.response?.data?.message) {
           setError(Array.isArray(err.response.data.message) ? err.response.data.message.join(', ') : err.response.data.message);
        } else {
           setError('Erro ao realizar reserva.');
        }
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-stone-100">
        
        <div className="px-8 py-5 border-b border-stone-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
              <Calendar className="w-6 h-6 text-clay-600" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-espresso-900 tracking-tight">Nova Reserva</h2>
              <p className="text-xs text-stone-500 font-light">Agende um espaço comum.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full text-stone-400 hover:text-espresso-800 transition-colors">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Área Comum</label>
            {loadingAreas ? (
              <div className="animate-pulse h-12 bg-stone-100 rounded-xl w-full" />
            ) : (
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-clay-500 transition-colors" strokeWidth={1.5} />
                <select 
                  {...register('commonAreaId', { required: 'Selecione uma área' })} 
                  className="w-full pl-12 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Selecione...</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.name} (Cap: {area.capacity})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            )}
            {errors.commonAreaId && <span className="text-xs text-red-500 ml-1">{errors.commonAreaId.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Início</label>
              <input 
                type="datetime-local" 
                {...register('date', { required: 'Data inicial obrigatória' })} 
                className="w-full px-3 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 text-sm focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50 transition-all" 
              />
              {errors.date && <span className="text-xs text-red-500 ml-1">{errors.date.message}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Fim <span className="text-stone-300 font-normal normal-case">(Opcional)</span></label>
              <input 
                type="datetime-local" 
                {...register('endDate')} 
                className="w-full px-3 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 text-sm focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50 transition-all" 
              />
            </div>
          </div>
          
          <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-lg border border-stone-100 flex items-start gap-2">
            <Clock className="w-4 h-4 text-clay-500 shrink-0 mt-0.5" />
            <p>Se o horário de fim não for informado, a reserva terá duração padrão de 1 hora.</p>
          </div>

          {error && (
             <div className="p-4 bg-red-50/50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0"/> {error}
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-sm font-medium text-stone-500 hover:bg-stone-50 hover:text-espresso-800 transition-colors">Cancelar</button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-6 py-3 bg-espresso-800 hover:bg-espresso-900 text-white rounded-xl text-sm font-medium shadow-lg shadow-stone-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}