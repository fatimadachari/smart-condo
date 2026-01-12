'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Users, LayoutDashboard, LogOut, Settings, Home, Megaphone, CalendarCheck, Building } from 'lucide-react';
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
        { name: 'Áreas Comuns', icon: Building, href: '/dashboard/areas-comuns' },
        { name: 'Reservas', icon: CalendarCheck, href: '/dashboard/reservas' },
    ];

    return (
        <aside className="w-64 bg-gunmetal-900 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-gunmetal-700 z-40">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-gunmetal-700 bg-gunmetal-900">
                <div className="flex items-center gap-2 text-terracotta-500">
                    <Building2 className="w-6 h-6" />
                    <span className="text-xl font-bold text-white tracking-wide">SmartCondo</span>
                </div>
            </div>

            {/* Menu Links */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
                ${isActive
                                    ? 'bg-terracotta-500 text-white shadow-glow'
                                    : 'text-gray-400 hover:bg-gunmetal-800 hover:text-white'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-terracotta-400'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-gunmetal-700">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Sair do Sistema
                </button>
            </div>
        </aside>
    );
}