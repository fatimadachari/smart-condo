'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search, ChevronRight, Calendar, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function Topbar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const paths = pathname.split('/').filter(Boolean);

  const today = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-30 transition-all duration-300 bg-stone-50/80 backdrop-blur-xl border-b border-stone-200/50 supports-[backdrop-filter]:bg-stone-50/60">
      
      <div className="flex items-center gap-6">
        <div className="hidden xl:flex items-center gap-2 text-stone-400 text-xs font-medium uppercase tracking-widest border-r border-stone-200 pr-6">
          <Calendar className="w-3.5 h-3.5" />
          <span className="capitalize">{today}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-stone-400 font-medium">SmartCondo</span>
          
          {paths.map((path, index) => (
            <div key={path} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-stone-300" />
              <span className={`capitalize font-medium ${
                index === paths.length - 1 
                  ? 'text-espresso-900 bg-stone-200/50 px-2 py-0.5 rounded-md'
                  : 'text-stone-500' 
              }`}>
                {path.replace('-', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        
        <div className="hidden md:flex relative group transition-all duration-300 focus-within:w-64 w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-clay-500 transition-colors" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-600 placeholder-stone-400 focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100/50 transition-all shadow-sm"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-0.5">
            <kbd className="hidden group-focus-within:inline-flex h-5 items-center gap-1 rounded border border-stone-200 bg-stone-50 px-1.5 font-mono text-[10px] font-medium text-stone-500 opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        <div className="h-6 w-px bg-stone-200 hidden md:block" />

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-stone-400 hover:text-espresso-800 hover:bg-white rounded-xl transition-all duration-200 group">
            <Bell className="w-5 h-5 group-hover:animate-swing" strokeWidth={1.5} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-clay-500 rounded-full border-2 border-stone-50 group-hover:border-white"></span>
          </button>

          <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white border border-transparent hover:border-stone-100 hover:shadow-sm transition-all duration-200 group">
            <div className="text-right hidden lg:block">
              <p className="text-xs font-bold text-espresso-900 leading-none mb-0.5 group-hover:text-clay-700 transition-colors">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-[10px] text-stone-400 font-medium uppercase tracking-widest">
                {user?.role || 'Visitante'}
              </p>
            </div>
            
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-espresso-800 to-espresso-900 flex items-center justify-center text-white font-medium shadow-md ring-2 ring-stone-50 group-hover:ring-clay-100 transition-all">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-sm border border-stone-100">
                <ChevronDown className="w-2.5 h-2.5 text-stone-400" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}