'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { X, User, Save, Loader2, Key, Mail, Building } from 'lucide-react';
import { usuarioService, CreateUsuarioDto, Usuario, UserRole } from '@/services/usuario-service';
import { condominioService, Condominio } from '@/services/condominio-service';
import { AxiosError } from 'axios';

interface UsuarioFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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

  useEffect(() => {
    setMounted(true);
    condominioService.getAll({ perPage: 100 }).then(res => setCondominios(res.data)).catch(console.error);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (usuarioToEdit) {
        setValue('name', usuarioToEdit.name);
        setValue('email', usuarioToEdit.email);
        setValue('role', usuarioToEdit.role);
        setValue('condominioId', usuarioToEdit.condominioId || '');
        setValue('password', ''); 
      } else {
        reset({ name: '', email: '', role: UserRole.MORADOR, condominioId: '', password: '' });
      }
      setError(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, usuarioToEdit, setValue, reset]);

  const onSubmit = async (data: CreateUsuarioDto) => {
    setIsSubmitting(true);
    setError(null);
    
    const payload = { ...data };
    if (usuarioToEdit && !payload.password) {
      delete payload.password;
    }

    if (!payload.condominioId) {
       delete payload.condominioId;
    }

    try {
      if (usuarioToEdit) {
        await usuarioService.update(usuarioToEdit.id, payload);
      } else {
        await usuarioService.create(payload);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError && err.response?.data?.message) {
         const msg = err.response.data.message;
         setError(Array.isArray(msg) ? msg.join(', ') : msg);
      } else {
         setError('Erro ao salvar usuário. Verifique os dados.');
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
              <User className="w-6 h-6 text-clay-600" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-espresso-900 tracking-tight">
                {usuarioToEdit ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
              <p className="text-xs text-stone-500 font-light">Credenciais e permissões de acesso.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full text-stone-400 hover:text-espresso-800 transition-colors">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Nome Completo</label>
            <input
              {...register('name', { required: 'Nome é obrigatório', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 placeholder-stone-400 focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50 transition-all"
              placeholder="Ex: João da Silva"
            />
            {errors.name && <span className="text-xs text-red-500 ml-1">{errors.name.message}</span>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">E-mail de Acesso</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-stone-400 group-focus-within:text-clay-500 transition-colors" strokeWidth={1.5} />
              <input
                {...register('email', { 
                  required: 'E-mail é obrigatório',
                  pattern: { value: /^\S+@\S+$/i, message: 'E-mail inválido' }
                })}
                type="email"
                className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 placeholder-stone-400 focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50 transition-all"
                placeholder="joao@email.com"
              />
            </div>
            {errors.email && <span className="text-xs text-red-500 ml-1">{errors.email.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Perfil</label>
              <div className="relative">
                <select
                  {...register('role', { required: true })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50 transition-all appearance-none cursor-pointer"
                >
                  <option value={UserRole.MORADOR}>Morador</option>
                  <option value={UserRole.SINDICO}>Síndico</option>
                  <option value={UserRole.PORTEIRO}>Porteiro</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Vínculo</label>
               <div className="relative">
                  <Building className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" strokeWidth={1.5} />
                  <select
                    {...register('condominioId')}
                    className="w-full pl-10 pr-8 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50 transition-all appearance-none cursor-pointer text-sm"
                  >
                    <option value="">Sem vínculo</option>
                    {condominios.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-4 border-t border-stone-100">
            <div className="flex justify-between items-center ml-1 mb-1">
               <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Senha de Acesso</label>
               {usuarioToEdit && <span className="text-[10px] text-clay-600 bg-clay-50 px-2 py-0.5 rounded-full font-medium">Opcional na edição</span>}
            </div>
            <div className="relative group">
              <Key className="absolute left-4 top-3.5 w-5 h-5 text-stone-400 group-focus-within:text-clay-500 transition-colors" strokeWidth={1.5} />
              <input
                {...register('password', { 
                   required: !usuarioToEdit && 'Senha é obrigatória',
                   minLength: { value: 6, message: 'Mínimo 6 caracteres' } 
                })}
                type="password"
                className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-espresso-900 placeholder-stone-400 focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50 transition-all"
                placeholder={usuarioToEdit ? "Deixe em branco para manter" : "Crie uma senha segura"}
              />
            </div>
             {errors.password && <span className="text-xs text-red-500 ml-1">{errors.password.message}</span>}
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