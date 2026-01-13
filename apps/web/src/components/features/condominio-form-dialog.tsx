'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { X, Building2, Save, Loader2, MapPin } from 'lucide-react';
import { condominioService, CreateCondominioDto, Condominio } from '@/services/condominio-service';

interface CondominioFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (condominio: Condominio) => void;
    condominioToEdit?: Condominio | null;
}

export function CondominioFormDialog({
    isOpen,
    onClose,
    onSuccess,
    condominioToEdit,
}: CondominioFormDialogProps) {
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateCondominioDto>();

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (condominioToEdit) {
                setValue('nome', condominioToEdit.nome);
                setValue('endereco', condominioToEdit.endereco || '');
            } else {
                reset({ nome: '', endereco: '' });
            }
            setError(null);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, condominioToEdit, setValue, reset]);

    const onSubmit = async (data: CreateCondominioDto) => {
        setIsSubmitting(true);
        setError(null);
        try {
            let result;
            if (condominioToEdit) {
                result = await condominioService.update(condominioToEdit.id, data);
            } else {
                result = await condominioService.create(data);
            }
            onSuccess(result);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Erro ao salvar. Verifique os dados.');
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

            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-8 py-5 border-b border-stone-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-stone-50 rounded-xl">
                            <Building2 className="w-6 h-6 text-clay-600" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-espresso-900">
                                {condominioToEdit ? 'Editar Condomínio' : 'Novo Condomínio'}
                            </h2>
                            <p className="text-xs text-stone-500 font-light">Detalhes do empreendimento.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full text-stone-400 hover:text-espresso-800 transition-colors">
                        <X className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 overflow-y-auto">

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Nome do Empreendimento</label>
                        <input
                            {...register('nome', { required: 'O nome é obrigatório' })}
                            type="text"
                            placeholder="Ex: Residencial Solar das Águas"
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 placeholder-stone-400 focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50 transition-all"
                        />
                        {errors.nome && <span className="text-xs text-red-500 ml-1">{errors.nome.message}</span>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Endereço Completo</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-stone-400 group-focus-within:text-clay-500 transition-colors" strokeWidth={1.5} />
                            <textarea
                                {...register('endereco')}
                                rows={3}
                                placeholder="Rua, Número, Bairro, Cidade..."
                                className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 placeholder-stone-400 focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50 transition-all resize-none"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50/50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"/> {error}
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
                            {condominioToEdit ? 'Salvar Alterações' : 'Cadastrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}