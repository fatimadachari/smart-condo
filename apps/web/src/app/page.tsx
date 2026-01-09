'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Building2, ArrowRight, Loader2 } from 'lucide-react'; // Ícone de prédio moderno
import { authService } from '@/services/auth-service';
import { LoginCredentials } from '@/types/auth-types';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await authService.login(data);
      authService.saveToken(response.access_token);
      router.push('/dashboard');
    } catch (err) {
      setError('Credenciais inválidas. Verifique e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      
      {/* COLUNA ESQUERDA - IDENTIDADE VISUAL */}
      <div className="hidden lg:flex w-5/12 bg-gunmetal-600 relative flex-col justify-between p-12 overflow-hidden">
        {/* Padrão de fundo sutil */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-500 to-transparent" />
        
        {/* Logo/Marca */}
        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
            <Building2 className="w-6 h-6 text-terracotta-400" />
          </div>
          <span className="text-xl font-bold tracking-wide">SmartCondo</span>
        </div>

        {/* Texto Conceitual */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            Gestão que transforma condomínios em <span className="text-terracotta-400">comunidades.</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Tecnologia invisível, segurança presente e o conforto que o seu lar merece.
          </p>
        </div>

        {/* Rodapé decorativo */}
        <div className="relative z-10 text-xs text-gray-500 uppercase tracking-widest">
          Enterprise System v1.0
        </div>
      </div>

      {/* COLUNA DIREITA - FORMULÁRIO */}
      <div className="flex-1 flex items-center justify-center bg-alabaster p-8">
        <div className="w-full max-w-md space-y-10">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gunmetal-600">Bem-vindo</h2>
            <p className="mt-2 text-gray-500">Acesse sua conta para continuar.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-5">
              {/* Input Email */}
              <div>
                <label className="block text-sm font-semibold text-gunmetal-600 mb-2">E-mail</label>
                <input
                  {...register('email', { required: 'E-mail obrigatório' })}
                  type="email"
                  placeholder="ex: sindico@smartcondo.com"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gunmetal-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-all duration-200"
                />
                {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
              </div>

              {/* Input Senha */}
              <div>
                <label className="block text-sm font-semibold text-gunmetal-600 mb-2">Senha</label>
                <input
                  {...register('senha', { required: 'Senha obrigatória' })}
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gunmetal-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-all duration-200"
                />
                {errors.senha && <span className="text-xs text-red-500 mt-1 block">{errors.senha.message}</span>}
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-center justify-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-4 px-6 rounded-xl text-white bg-terracotta-500 hover:bg-terracotta-600 font-semibold text-lg transition-all duration-300 shadow-glow hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Esqueceu a senha? <a href="#" className="text-terracotta-500 hover:text-terracotta-600 font-medium">Recuperar acesso</a>
          </p>
        </div>
      </div>
    </div>
  );
}