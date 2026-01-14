'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { X, Megaphone, Save, Loader2, Calendar, AlertCircle, Info, FileText } from 'lucide-react';
import { avisosService, CreateAvisoDto, Aviso, TipoAviso } from '@/services/aviso-service';
import { AxiosError } from 'axios';

interface AvisoFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (aviso?: Aviso) => void;
  avisoToEdit?: Aviso | null;
}

export function AvisoFormDialog({
  isOpen,
  onClose,
  onSuccess,
  avisoToEdit,
}: AvisoFormDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateAvisoDto>();
  
  const tipoSelecionado = watch('tipo');

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (avisoToEdit) {
        setValue('titulo', avisoToEdit.titulo);
        setValue('descricao', avisoToEdit.descricao);
        setValue('tipo', avisoToEdit.tipo);
        
        if (avisoToEdit.dataEvento) {
          const datePart = new Date(avisoToEdit.dataEvento).toISOString().split('T')[0];
          setValue('dataEvento', datePart);
        }
      } else {
        reset({ 
          titulo: '', 
          descricao: '', 
          tipo: TipoAviso.GERAL, 
          dataEvento: '' 
        });
      }
      setError(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, avisoToEdit, setValue, reset]);

  const onSubmit = async (data: CreateAvisoDto) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...data,
        dataEvento: data.dataEvento ? new Date(data.dataEvento).toISOString() : undefined
      };

      let result;
      if (avisoToEdit) {
        result = await avisosService.update(avisoToEdit.id, payload);
      } else {
        result = await avisosService.create(payload);
      }

      onSuccess(result);
      onClose();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError && err.response?.data?.message) {
         const msg = err.response.data.message;
         setError(Array.isArray(msg) ? msg.join(', ') : msg);
      } else {
         setError('Erro ao salvar o aviso. Verifique os dados.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-stone-100">
        
        <div className="px-8 py-5 border-b border-stone-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
              <Megaphone className="w-6 h-6 text-clay-600" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-espresso-900 tracking-tight">
                {avisoToEdit ? 'Editar Comunicado' : 'Novo Comunicado'}
              </h2>
              <p className="text-xs text-stone-500 font-light">Publique informações no mural.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full text-stone-400 hover:text-espresso-800 transition-colors">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Título do Aviso</label>
            <input 
              {...register('titulo', { required: 'Título é obrigatório' })} 
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 placeholder-stone-400 focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50 transition-all"
              placeholder="Ex: Manutenção da Piscina" 
            />
            {errors.titulo && <span className="text-xs text-red-500 ml-1">{errors.titulo.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Prioridade</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`
                cursor-pointer relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                ${tipoSelecionado === TipoAviso.GERAL 
                  ? 'border-clay-400 bg-clay-50/50 text-clay-800' 
                  : 'border-stone-100 hover:border-stone-200 text-stone-500'}
              `}>
                <input type="radio" value={TipoAviso.GERAL} {...register('tipo')} className="hidden" />
                <Info className={`w-6 h-6 ${tipoSelecionado === TipoAviso.GERAL ? 'text-clay-600' : 'text-stone-300'}`} />
                <span className="font-medium text-sm">Geral</span>
                {tipoSelecionado === TipoAviso.GERAL && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-clay-500" />}
              </label>

              <label className={`
                cursor-pointer relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                ${tipoSelecionado === TipoAviso.URGENTE 
                  ? 'border-red-400 bg-red-50/50 text-red-800' 
                  : 'border-stone-100 hover:border-stone-200 text-stone-500'}
              `}>
                <input type="radio" value={TipoAviso.URGENTE} {...register('tipo')} className="hidden" />
                <AlertCircle className={`w-6 h-6 ${tipoSelecionado === TipoAviso.URGENTE ? 'text-red-600' : 'text-stone-300'}`} />
                <span className="font-medium text-sm">Urgente</span>
                {tipoSelecionado === TipoAviso.URGENTE && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />}
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Data do Acontecimento <span className="text-stone-300 font-normal normal-case">(Opcional)</span></label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-clay-500 transition-colors" strokeWidth={1.5} />
              <input 
                type="date" 
                {...register('dataEvento')} 
                className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50 transition-all" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Descrição Detalhada</label>
            <div className="relative">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-stone-400" strokeWidth={1.5} />
                <textarea 
                {...register('descricao', { required: 'Descrição é obrigatória' })} 
                rows={4} 
                className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 placeholder-stone-400 focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50 transition-all resize-none"
                placeholder="Descreva os detalhes do aviso..."
                />
            </div>
             {errors.descricao && <span className="text-xs text-red-500 ml-1">{errors.descricao.message}</span>}
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
              {avisoToEdit ? 'Salvar Alterações' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}