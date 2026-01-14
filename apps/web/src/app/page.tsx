'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Building2, ArrowRight, Loader2, Lock, Mail } from 'lucide-react';
import { authService } from '@/services/auth-service';
import { LoginCredentials } from '@/types/auth-types';
import { AxiosError } from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setGeneralError('');

    try {
      const response = await authService.login(data);

      console.log('Login Payload:', response); 

      if (response?.accessToken) {
        authService.saveToken(response.accessToken);

        await new Promise(resolve => setTimeout(resolve, 100));
        router.push('/dashboard');
      } else {
        throw new Error('Token não recebido na resposta');
      }

    } catch (err: unknown) {
      console.error('Erro no login:', err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex font-sans bg-stone-50 text-stone-800">

      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-espresso-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-overlay grayscale-[20%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-900 via-espresso-900/60 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full h-full">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/5">
              <Building2 className="w-5 h-5 text-clay-200" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-semibold tracking-widest text-white uppercase opacity-90">SmartCondo</span>
          </div>

          <div className="max-w-lg">
            <h1 className="text-5xl font-light text-white mb-8 leading-[1.1]">
              A excelência que <br />
              <span className="font-semibold text-clay-200">seu patrimônio</span> merece.
            </h1>
            <p className="text-stone-300 text-lg font-light leading-relaxed border-l border-clay-500/50 pl-6">
              Gestão condominial elevada ao estado da arte. Tecnologia, transparência e design em um só lugar.
            </p>
          </div>

          <div className="flex justify-between items-end text-xs text-stone-500 tracking-widest uppercase">
            <span>© 2026 SmartCondo</span>
            <span>Estilo & Segurança</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-stone-50">
        <div className="w-full max-w-[420px]">

          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-espresso-800 tracking-tight">Login</h2>
            <p className="mt-3 text-stone-500 font-light">Bem-vindo de volta ao seu painel de controle.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            <div className="space-y-6">
              <div className="group">
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 ml-1">E-mail</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 w-5 h-5 text-stone-400 group-focus-within:text-clay-500 transition-colors duration-300" strokeWidth={1.5} />
                  <input
                    {...register('email', { required: 'O e-mail é obrigatório' })}
                    type="email"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-xl text-stone-700 placeholder-stone-300 focus:outline-none focus:border-clay-400 focus:ring-4 focus:ring-clay-100 transition-all duration-300"
                    placeholder="nome@empresa.com"
                  />
                </div>
                {errors.email && <span className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</span>}
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">Senha</label>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 w-5 h-5 text-stone-400 group-focus-within:text-clay-500 transition-colors duration-300" strokeWidth={1.5} />
                  <input
                    {...register('senha', { required: 'A senha é obrigatória' })}
                    type="password"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-xl text-stone-700 placeholder-stone-300 focus:outline-none focus:border-clay-400 focus:ring-4 focus:ring-clay-100 transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>
                {errors.senha && <span className="text-xs text-red-500 mt-1 ml-1">{errors.senha.message}</span>}
              </div>
            </div>

            {generalError && (
              <div className="p-4 rounded-lg bg-red-50/50 border border-red-100 text-red-600 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {generalError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-4 px-6 rounded-xl text-white bg-espresso-800 hover:bg-espresso-900 transition-all duration-300 shadow-lg shadow-stone-200 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="font-medium tracking-wide">Acessar Sistema</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform opacity-70" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}