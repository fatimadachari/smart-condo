'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { X, Home, Save, Loader2 } from 'lucide-react';
import { unidadeService, CreateUnidadeDto, Unidade } from '@/services/unidade-service';
import { condominioService, Condominio } from '@/services/condominio-service';

interface UnidadeFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (unidade: Unidade) => void;
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
    const [condominios, setCondominios] = useState<Condominio[]>([]); // Lista para o Select
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateUnidadeDto>();

    // Mount e Fetch de Condomínios
    useEffect(() => {
        setMounted(true);
        // Carrega a lista de condomínios para o dropdown
        condominioService.getAll().then(setCondominios).catch(console.error);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
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
    }, [isOpen, unidadeToEdit, setValue, reset]);

    const onSubmit = async (data: CreateUnidadeDto) => {
        setIsSubmitting(true);
        setError(null);

        try {
            let result;
            if (unidadeToEdit) {
                result = await unidadeService.update(unidadeToEdit.id, data);
            } else {
                result = await unidadeService.create(data);
            }
            // Precisamos garantir que o objeto de retorno tenha o condomínio preenchido visualmente
            // (O backend pode não retornar o include no create/update dependendo da implementação)
            // Aqui fazemos um "patch" visual rápido se necessário, ou confiamos no backend.
            // Vamos recarregar a lista no pai por segurança ou apenas passar o result.

            onSuccess(result);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Erro ao salvar unidade.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gunmetal-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-terracotta-100 flex items-center justify-center text-terracotta-600">
                            <Home className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gunmetal-600">
                                {unidadeToEdit ? 'Editar Unidade' : 'Nova Unidade'}
                            </h2>
                            <p className="text-xs text-gray-500">Defina a identificação e o vínculo</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">

                    {/* Select Condomínio */}
                    <div>
                        <label className="block text-sm font-medium text-gunmetal-600 mb-1.5">
                            Condomínio <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register('condominioId', { required: 'Selecione um condomínio' })}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gunmetal-600 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                        >
                            <option value="">Selecione...</option>
                            {condominios.map(c => (
                                <option key={c.id} value={c.id}>{c.nome}</option>
                            ))}
                        </select>
                        {errors.condominioId && <span className="text-xs text-red-500 mt-1">{errors.condominioId.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Identificação */}
                        <div>
                            <label className="block text-sm font-medium text-gunmetal-600 mb-1.5">
                                Identificação <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register('identificacao', { required: 'Obrigatório' })}
                                placeholder="Ex: 101"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                            />
                            {errors.identificacao && <span className="text-xs text-red-500 mt-1">{errors.identificacao.message}</span>}
                        </div>

                        {/* Bloco */}
                        <div>
                            <label className="block text-sm font-medium text-gunmetal-600 mb-1.5">
                                Bloco (Opcional)
                            </label>
                            <input
                                {...register('bloco')}
                                placeholder="Ex: A"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                            />
                        </div>
                    </div>

                    {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 text-sm font-medium text-white bg-terracotta-500 hover:bg-terracotta-600 rounded-lg flex items-center gap-2 disabled:opacity-70"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}