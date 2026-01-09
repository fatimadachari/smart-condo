'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { X, User, Save, Loader2, Key } from 'lucide-react';
import { usuarioService, CreateUsuarioDto, Usuario, UserRole } from '@/services/usuario-service';
import { condominioService, Condominio } from '@/services/condominio-service';

interface UsuarioFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (usuario: Usuario) => void;
    usuarioToEdit?: Usuario | null;
}

export function UsuarioFormDialog({
    isOpen,
    onClose,
    onSuccess,
    usuarioToEdit,
}: UsuarioFormDialogProps) {
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [condominios, setCondominios] = useState<Condominio[]>([]);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateUsuarioDto>();

    // Carregar lista de condomínios
    useEffect(() => {
        setMounted(true);
        condominioService.getAll().then(setCondominios).catch(console.error);
        return () => setMounted(false);
    }, []);

    // Setup do formulário ao abrir
    useEffect(() => {
        if (isOpen) {
            if (usuarioToEdit) {
                // EDIÇÃO
                setValue('name', usuarioToEdit.name);
                setValue('email', usuarioToEdit.email);
                setValue('role', usuarioToEdit.role);
                setValue('condominioId', usuarioToEdit.condominioId || '');
                setValue('password', ''); // Senha começa vazia na edição
            } else {
                // CRIAÇÃO
                reset({ name: '', email: '', role: UserRole.MORADOR, condominioId: '', password: '' });
            }
            setError(null);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, usuarioToEdit, setValue, reset]);

    const onSubmit = async (data: CreateUsuarioDto) => {
        setIsSubmitting(true);
        setError(null);

        // Regra: Na edição, se senha vier vazia, remove do payload para não sobrescrever
        const payload = { ...data };
        if (usuarioToEdit && !payload.password) {
            delete payload.password;
        }

        try {
            let result;
            if (usuarioToEdit) {
                result = await usuarioService.update(usuarioToEdit.id, payload);
            } else {
                result = await usuarioService.create(payload);
            }
            onSuccess(result);
            onClose();
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || 'Erro ao salvar usuário.';
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gunmetal-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-terracotta-100 flex items-center justify-center text-terracotta-600">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gunmetal-600">
                                {usuarioToEdit ? 'Editar Usuário' : 'Novo Usuário'}
                            </h2>
                            <p className="text-xs text-gray-500">Gerencie o acesso ao sistema</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 overflow-y-auto">

                    {/* Nome */}
                    <div>
                        <label className="block text-sm font-medium text-gunmetal-600 mb-1.5">Nome Completo <span className="text-red-500">*</span></label>
                        <input
                            {...register('name', { required: 'Nome é obrigatório' })}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gunmetal-600 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                            placeholder="Ex: João da Silva"
                        />
                        {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name.message}</span>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gunmetal-600 mb-1.5">E-mail de Acesso <span className="text-red-500">*</span></label>
                        <input
                            {...register('email', { required: 'E-mail é obrigatório' })}
                            type="email"
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gunmetal-600 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                            placeholder="joao@email.com"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Perfil */}
                        <div>
                            <label className="block text-sm font-medium text-gunmetal-600 mb-1.5">Perfil <span className="text-red-500">*</span></label>
                            <select
                                {...register('role', { required: true })}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gunmetal-600 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                            >
                                <option value={UserRole.MORADOR}>Morador</option>
                                <option value={UserRole.SINDICO}>Síndico</option>
                                <option value={UserRole.PORTEIRO}>Porteiro</option>
                                <option value={UserRole.ADMIN}>Administrador</option>
                            </select>
                        </div>

                        {/* Condomínio */}
                        <div>
                            <label className="block text-sm font-medium text-gunmetal-600 mb-1.5">Vínculo</label>
                            <select
                                {...register('condominioId')}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gunmetal-600 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                            >
                                <option value="">Sem vínculo</option>
                                {condominios.map(c => (
                                    <option key={c.id} value={c.id}>{c.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Senha */}
                    <div className="pt-2 border-t border-gray-100">
                        <label className="block text-sm font-medium text-gunmetal-600 mb-1.5 flex items-center gap-2">
                            <Key className="w-4 h-4 text-terracotta-500" />
                            Senha
                            {usuarioToEdit && <span className="text-xs font-normal text-gray-400">(Opcional na edição)</span>}
                        </label>
                        <input
                            {...register('password', { required: !usuarioToEdit && 'Senha é obrigatória' })}
                            type="password"
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gunmetal-600 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                            placeholder={usuarioToEdit ? "Deixe em branco para manter a atual" : "Crie uma senha segura"}
                        />
                        {errors.password && <span className="text-xs text-red-500 mt-1">{errors.password.message}</span>}
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