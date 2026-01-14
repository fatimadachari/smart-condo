'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { X, Loader2, Users, Coffee, Save, Power, FileText } from 'lucide-react';
import { commonAreaService, CreateCommonAreaDto, CommonArea } from '@/services/common-area-service';
import { AxiosError } from 'axios';

interface CommonAreaFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  areaToEdit?: CommonArea | null;
}

export function CommonAreaFormDialog({
  isOpen,
  onClose,
  onSuccess,
  areaToEdit,
}: CommonAreaFormDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateCommonAreaDto>();
  
  const isActive = watch('isActive');

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (areaToEdit) {
        setValue('name', areaToEdit.name);
        setValue('description', areaToEdit.description || '');
        setValue('capacity', areaToEdit.capacity || 10);
        setValue('isActive', areaToEdit.isActive);
      } else {
        reset({ 
          name: '', 
          description: '', 
          capacity: 10,
          isActive: true 
        });
      }
      setError(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, areaToEdit, setValue, reset]);

  const onSubmit = async (data: CreateCommonAreaDto) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (areaToEdit) {
        await commonAreaService.update(areaToEdit.id, data);
      } else {
        await commonAreaService.create(data);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError && err.response?.data?.message) {
         const msg = err.response.data.message;
         setError(Array.isArray(msg) ? msg.join(', ') : msg);
      } else {
         setError('Erro ao salvar área comum. Verifique os dados.');
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
              <Coffee className="w-6 h-6 text-clay-600" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-espresso-900 tracking-tight">
                {areaToEdit ? 'Editar Espaço' : 'Nova Área Comum'}
              </h2>
              <p className="text-xs text-stone-500 font-light">Detalhes do local para reservas.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full text-stone-400 hover:text-espresso-800 transition-colors">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Nome do Espaço</label>
            <input 
              {...register('name', { required: 'Nome é obrigatório', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })} 
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 placeholder-stone-400 focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50 transition-all" 
              placeholder="Ex: Salão de Festas A" 
            />
            {errors.name && <span className="text-xs text-red-500 ml-1">{errors.name.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Capacidade</label>
              <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-clay-500 transition-colors" strokeWidth={1.5} />
                <input 
                  type="number"
                  min="1"
                  {...register('capacity', { required: 'Capacidade obrigatória', min: 1 })} 
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50 transition-all" 
                />
              </div>
              {errors.capacity && <span className="text-xs text-red-500 ml-1">{errors.capacity.message}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Status</label>
              <label className={`
                cursor-pointer flex items-center justify-between px-4 py-3 rounded-xl border transition-all select-none
                ${isActive ? 'bg-green-50 border-green-200 text-green-800' : 'bg-stone-50 border-stone-200 text-stone-500'}
              `}>
                <div className="flex items-center gap-2">
                  <Power className="w-4 h-4" />
                  <span className="text-sm font-medium">{isActive ? 'Disponível' : 'Manutenção'}</span>
                </div>
                <input type="checkbox" {...register('isActive')} className="hidden" />
                <div className={`w-3 h-3 rounded-full transition-colors ${isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-stone-300'}`} />
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Regras / Descrição</label>
            <div className="relative group">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-stone-400 group-focus-within:text-clay-500 transition-colors" strokeWidth={1.5} />
                <textarea 
                {...register('description')} 
                rows={3} 
                className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 placeholder-stone-400 focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50 transition-all resize-none"
                placeholder="Ex: Inclui limpeza pós-uso. Horário máximo 22h."
                />
            </div>
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
              {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
              Salvar Área
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}