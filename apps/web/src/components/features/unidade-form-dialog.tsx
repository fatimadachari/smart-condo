'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { X, Save, Loader2, Home, Layers, Building } from 'lucide-react';
import { unidadeService, CreateUnidadeDto, Unidade } from '@/services/unidade-service';
import { condominioService, Condominio } from '@/services/condominio-service';
import { AxiosError } from 'axios';

interface UnidadeFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  unidadeToEdit?: Unidade | null;
}

export function UnidadeFormDialog({
  isOpen,
  onClose,
  onSuccess,
  unidadeToEdit,
}: UnidadeFormDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCondos, setIsLoadingCondos] = useState(false);
  const [condominios, setCondominios] = useState<Condominio[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateUnidadeDto>();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const loadCondos = async () => {
        setIsLoadingCondos(true);
        try {
          const response = await condominioService.getAll({ perPage: 100 }); 
          setCondominios(response.data);
        } catch (err) {
          console.error(err);
          setError('Erro ao carregar lista de condomínios.');
        } finally {
          setIsLoadingCondos(false);
        }
      };
      loadCondos();

      if (unidadeToEdit) {
        setValue('identificacao', unidadeToEdit.identificacao);
        setValue('bloco', unidadeToEdit.bloco || '');
        setValue('condominioId', unidadeToEdit.condominioId);
      } else {
        reset({ identificacao: '', bloco: '', condominioId: '' });
      }
      setError(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, unidadeToEdit, setValue, reset]);

  const onSubmit = async (data: CreateUnidadeDto) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (unidadeToEdit) {
        await unidadeService.update(unidadeToEdit.id, data);
      } else {
        await unidadeService.create(data);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.message) {
         setError(Array.isArray(err.response.data.message) 
            ? err.response.data.message.join(', ') 
            : err.response.data.message);
      } else {
        setError('Erro ao salvar unidade. Verifique os dados.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-stone-100">
        
        <div className="px-8 py-5 border-b border-stone-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
              <Home className="w-6 h-6 text-clay-600" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-espresso-900 tracking-tight">
                {unidadeToEdit ? 'Editar Unidade' : 'Nova Unidade'}
              </h2>
              <p className="text-xs text-stone-500 font-light">
                Dados do apartamento ou casa.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full text-stone-400 hover:text-espresso-800 transition-colors">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Condomínio</label>
            <div className="relative">
              <Building className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" strokeWidth={1.5} />
              <select
                {...register('condominioId', { required: 'Selecione um condomínio' })}
                className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50 appearance-none disabled:opacity-50"
                disabled={isLoadingCondos}
              >
                <option value="">Selecione...</option>
                {condominios.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
            {errors.condominioId && <span className="text-xs text-red-500 ml-1">{errors.condominioId.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Identificação</label>
              <input
                {...register('identificacao', { required: 'Obrigatório (ex: 101, 202)' })}
                type="text"
                placeholder="Ex: 101"
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 placeholder-stone-400 focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50"
              />
              {errors.identificacao && <span className="text-xs text-red-500 ml-1">{errors.identificacao.message}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Bloco / Torre</label>
              <div className="relative">
                <Layers className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" strokeWidth={1.5} />
                <input
                  {...register('bloco')}
                  type="text"
                  placeholder="Ex: A"
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 placeholder-stone-400 focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50/50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0"/> {error}
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-sm font-medium text-stone-500 hover:bg-stone-50 hover:text-espresso-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-espresso-800 hover:bg-espresso-900 text-white rounded-xl text-sm font-medium shadow-lg shadow-stone-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {unidadeToEdit ? 'Salvar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}