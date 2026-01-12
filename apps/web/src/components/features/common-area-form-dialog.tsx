'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { X, Loader2, Users, Building } from 'lucide-react';
import { commonAreaService, CreateCommonAreaDto, CommonArea } from '@/services/common-area-service';

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
    
    const { register, handleSubmit, reset, setValue } = useForm<CreateCommonAreaDto>();

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (areaToEdit) {
                setValue('name', areaToEdit.name);
                setValue('description', areaToEdit.description);
                setValue('capacity', areaToEdit.capacity);
                setValue('isActive', areaToEdit.isActive);
            } else {
                reset({ 
                    name: '', 
                    description: '', 
                    capacity: 10,
                    isActive: true 
                });
            }
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, areaToEdit, setValue, reset]);

    const onSubmit = async (data: CreateCommonAreaDto) => {
        setIsSubmitting(true);
        try {
            // Converter capacidade para número (o input HTML retorna string)
            const payload = {
                ...data,
                capacity: Number(data.capacity)
            };

            if (areaToEdit) {
                await commonAreaService.update(areaToEdit.id, payload);
            } else {
                await commonAreaService.create(payload);
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar área comum.');
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
                        {areaToEdit ? 'Editar Área' : 'Nova Área Comum'}
                    </h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" /></button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 overflow-y-auto">
                    
                    {/* NOME */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Espaço</label>
                        <div className="relative">
                            <Building className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input 
                                {...register('name', { required: true })} 
                                className="w-full border border-gray-300 rounded-lg p-2 pl-10 focus:ring-2 focus:ring-terracotta-500 outline-none" 
                                placeholder="Ex: Salão de Festas A" 
                            />
                        </div>
                    </div>

                    {/* CAPACIDADE */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacidade (Pessoas)</label>
                        <div className="relative">
                            <Users className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input 
                                type="number"
                                min="1"
                                {...register('capacity', { required: true, min: 1 })} 
                                className="w-full border border-gray-300 rounded-lg p-2 pl-10 focus:ring-2 focus:ring-terracotta-500 outline-none" 
                            />
                        </div>
                    </div>

                    {/* DESCRIÇÃO */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição / Regras (Opcional)</label>
                        <textarea 
                            {...register('description')} 
                            rows={3} 
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-terracotta-500 outline-none"
                            placeholder="Ex: Inclui limpeza pós-uso. Horário máximo 22h."
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-600">Cancelar</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-lg flex items-center gap-2 font-medium shadow-lg shadow-terracotta-500/20">
                            {isSubmitting && <Loader2 className="animate-spin w-4 h-4" />}
                            Salvar Área
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}