'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { X, Building2, Save, Loader2 } from 'lucide-react';
import { condominioService, CreateCondominioDto, Condominio } from '@/services/condominio-service';

interface CondominioFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (condominio: Condominio) => void; // Avisa o pai que deu certo
    condominioToEdit?: Condominio | null; // Se vier preenchido, é EDIÇÃO
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

    // Configuração do Formulário
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateCondominioDto>();

    // Mount do Portal
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Resetar o form quando abrir/fechar ou mudar o modo (Edição/Criação)
    useEffect(() => {
        if (isOpen) {
            if (condominioToEdit) {
                // MODO EDIÇÃO: Preenche os campos
                setValue('nome', condominioToEdit.nome);
                setValue('endereco', condominioToEdit.endereco || '');
            } else {
                // MODO CRIAÇÃO: Limpa tudo
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
                // Editar
                result = await condominioService.update(condominioToEdit.id, data);
            } else {
                // Criar
                result = await condominioService.create(data);
            }

            onSuccess(result); // Devolve o dado novo para a tabela atualizar
            onClose(); // Fecha o modal
        } catch (err) {
            console.error(err);
            setError('Erro ao salvar condomínio. Verifique os dados.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gunmetal-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Janela do Modal */}
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                {/* Cabeçalho */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-terracotta-100 flex items-center justify-center text-terracotta-600">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gunmetal-600">
                                {condominioToEdit ? 'Editar Condomínio' : 'Novo Condomínio'}
                            </h2>
                            <p className="text-xs text-gray-500">Preencha as informações abaixo</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 overflow-y-auto">

                    {/* Campo Nome */}
                    <div>
                        <label className="block text-sm font-medium text-gunmetal-600 mb-1.5">
                            Nome do Empreendimento <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('nome', { required: 'O nome é obrigatório' })}
                            type="text"
                            placeholder="Ex: Residencial Solar das Águas"
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gunmetal-600 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-all"
                        />
                        {errors.nome && <span className="text-xs text-red-500 mt-1">{errors.nome.message}</span>}
                    </div>

                    {/* Campo Endereço */}
                    <div>
                        <label className="block text-sm font-medium text-gunmetal-600 mb-1.5">
                            Endereço Completo
                        </label>
                        <textarea
                            {...register('endereco')}
                            rows={3}
                            placeholder="Rua, Número, Bairro, Cidade..."
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gunmetal-600 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-all resize-none"
                        />
                    </div>

                    {/* Erro da API */}
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* Botões de Ação */}
                    <div className="pt-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 text-sm font-medium text-white bg-terracotta-500 hover:bg-terracotta-600 rounded-lg shadow-sm shadow-terracotta-500/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    {condominioToEdit ? 'Salvar Alterações' : 'Cadastrar'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}