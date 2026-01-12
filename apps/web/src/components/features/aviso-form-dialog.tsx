'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { X, Megaphone, Save, Loader2, Calendar } from 'lucide-react';
import { avisosService, CreateAvisoDto, Aviso } from '@/services/aviso-service';

interface AvisoFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (aviso: Aviso) => void;
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
                    tipo: 'GERAL', 
                    dataEvento: '' 
                });
            }
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, avisoToEdit, setValue, reset]);

    const onSubmit = async (data: CreateAvisoDto) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                dataEvento: data.dataEvento ? new Date(data.dataEvento).toISOString() : undefined
            };

            let result;
            if (avisoToEdit) {
                // CHAMA O  AGORA
                result = await avisosService.update(avisoToEdit.id, payload);
            } else {
                result = await avisosService.create(payload);
            }

            onSuccess(result);
            onClose();
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar. Verifique os dados.');
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
                    <h2 className="text-lg font-bold text-gray-700">
                        {avisoToEdit ? 'Editar Aviso' : 'Novo Aviso'}
                    </h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 overflow-y-auto">
                    
                    {/* TÍTULO */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input {...register('titulo', { required: true })} className="w-full border rounded-lg p-2" placeholder="Ex: Reforma" />
                    </div>

                    {/* TIPO */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                        <div className="flex gap-4">
                            <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 ${tipoSelecionado === 'GERAL' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200'}`}>
                                <input type="radio" value="GERAL" {...register('tipo')} className="hidden" />
                                <div className="w-2 h-2 rounded-full bg-blue-500" /> Geral
                            </label>

                            <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 ${tipoSelecionado === 'URGENTE' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-200'}`}>
                                <input type="radio" value="URGENTE" {...register('tipo')} className="hidden" />
                                <div className="w-2 h-2 rounded-full bg-red-500" /> Urgente
                            </label>
                        </div>
                    </div>

                    {/* DATA DO EVENTO (NOVO) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data do Acontecimento (Opcional)</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input 
                                type="date" 
                                {...register('dataEvento')} 
                                className="w-full border rounded-lg p-2 pl-10" 
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Deixe em branco se for apenas um comunicado informativo.</p>
                    </div>

                    {/* DESCRIÇÃO */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea {...register('descricao', { required: true })} rows={4} className="w-full border rounded-lg p-2" />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancelar</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                            {isSubmitting && <Loader2 className="animate-spin w-4 h-4" />}
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}