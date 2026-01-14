'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  Users, 
  LayoutDashboard, 
  LogOut, 
  Home, 
  Megaphone, 
  CalendarCheck, 
  Building,
  Coffee
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Visão Geral', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Avisos', icon: Megaphone, href: '/dashboard/avisos' },
    { name: 'Condomínios', icon: Building2, href: '/dashboard/condominios' },
    { name: 'Unidades', icon: Home, href: '/dashboard/unidades' },
    { name: 'Usuários', icon: Users, href: '/dashboard/usuarios' },
    { name: 'Áreas Comuns', icon: Coffee, href: '/dashboard/areas-comuns' }, 
    { name: 'Reservas', icon: CalendarCheck, href: '/dashboard/reservas' },
  ];

  return (
    <aside className="w-72 bg-espresso-900 text-stone-300 flex flex-col h-screen fixed left-0 top-0 border-r border-espresso-800 z-40 shadow-2xl transition-all duration-300">
      
      <div className="h-24 flex items-center px-8 bg-espresso-900 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded border border-white/10">
             <Building2 className="w-5 h-5 text-clay-300" strokeWidth={1.5} />
          </div>
          <span className="text-xl font-light text-white tracking-widest uppercase">
            Smart<span className="font-bold text-clay-200">Condo</span>
          </span>
        </div>
      </div>

      <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-xs font-bold text-espresso-500 uppercase tracking-widest mb-4">
          Menu Principal
        </p>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm transition-all duration-300 group relative overflow-hidden
                ${isActive 
                  ? 'bg-white/5 text-white shadow-inner-light' 
                  : 'text-stone-400 hover:bg-white/5 hover:text-stone-200'
                }
              `}
            >
              {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-clay-400 rounded-r-full" />}

              <Icon 
                className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-clay-300' : 'text-espresso-600 group-hover:text-clay-300'}`} 
                strokeWidth={1.5} 
              />
              <span className="font-medium tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-espresso-800 bg-espresso-900/50 shrink-0">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-stone-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:stroke-red-400 transition-colors" strokeWidth={1.5} />
          Encerrar Sessão
        </button>
      </div>
    </aside>
  );
}