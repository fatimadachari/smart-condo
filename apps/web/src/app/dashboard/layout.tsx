'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar'; // Certifique-se de ter criado o arquivo src/components/layout/topbar.tsx
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { loading } = useAuth();

    // Estado de Carregamento Inicial
    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-stone-50">
                <Loader2 className="w-10 h-10 text-clay-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 font-sans selection:bg-clay-200 selection:text-espresso-900 flex">
            
            {/* Sidebar Fixa à Esquerda */}
            <Sidebar />

            {/* Área Principal */}
            {/* ml-72 (18rem/288px) compensa a largura da Sidebar fixa */}
            <main className="ml-72 flex-1 flex flex-col min-h-screen transition-all duration-300 relative">
                
                {/* Topbar Sticky (Separado em componente) */}
                <Topbar />

                {/* Área de Conteúdo Injetada (Children) */}
                {/* Animação suave na troca de páginas */}
                <div className="flex-1 p-8 xl:p-10 max-w-[1920px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
                
                {/* Footer Minimalista (Fixo no final do conteúdo) */}
                <footer className="py-6 px-10 text-center text-[10px] text-stone-400 uppercase tracking-widest border-t border-stone-100/50 mt-auto">
                    SmartCondo System © 2026 • v2.0
                </footer>
            </main>
        </div>
    );
}