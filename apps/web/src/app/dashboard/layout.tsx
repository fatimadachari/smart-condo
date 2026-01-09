'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Bell, Search } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    // Enquanto verifica o token, mostra loading
    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-alabaster">
                <Loader2 className="w-8 h-8 text-terracotta-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-alabaster">
            <Sidebar />

            {/* Área Principal (deslocada para direita por causa da Sidebar fixa) */}
            <main className="ml-64 min-h-screen flex flex-col">

                {/* Topbar Simples */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">

                    {/* Barra de Busca (Decorativa por enquanto) */}
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar condomínios, moradores..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                        />
                    </div>

                    {/* Área do Usuário */}
                    <div className="flex items-center gap-6">
                        <button className="relative text-gray-400 hover:text-terracotta-500 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-gunmetal-600">{user?.nome}</p>
                                <p className="text-xs text-terracotta-500 font-medium uppercase tracking-wider">{user?.tipo}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-terracotta-100 flex items-center justify-center text-terracotta-700 font-bold border-2 border-white shadow-sm">
                                {user?.nome?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Conteúdo da Página */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}