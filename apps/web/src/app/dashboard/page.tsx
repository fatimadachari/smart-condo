'use client';

import { useEffect, useState } from 'react';
import {
    Building2,
    Home,
    Users,
    PlusCircle,
    ArrowRight,
    TrendingUp,
    Activity,
    Megaphone,
    CalendarCheck // <--- Importado
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { condominioService } from '@/services/condominio-service';
import { unidadeService } from '@/services/unidade-service';
import { usuarioService } from '@/services/usuario-service';
import { avisosService } from '@/services/aviso-service';
import { bookingService } from '@/services/booking-service'; // <--- Importado

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        condominios: 0,
        unidades: 0,
        usuarios: 0,
        avisos: 0,
        reservas: 0 // <--- Novo estado
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                // Buscamos tudo em paralelo (Adicionado bookingService)
                const [condos, units, users, avisosData, bookingsData] = await Promise.all([
                    condominioService.getAll(),
                    unidadeService.getAll(),
                    usuarioService.getAll(),
                    avisosService.getAll(),
                    bookingService.getAll() // <--- Chamada nova
                ]);

                setStats({
                    condominios: condos.length,
                    unidades: units.length,
                    usuarios: users.length,
                    avisos: avisosData.length,
                    reservas: bookingsData.length // <--- Setando valor
                });
            } catch (error) {
                console.error('Erro ao carregar estatísticas', error);
            } finally {
                setLoading(false);
            }
        }

        loadStats();
    }, []);

    // Componente de Card de Estatística
    const StatCard = ({ title, value, icon: Icon, colorClass, delay }: any) => (
        <div
            className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4`}
            style={{ animationDelay: delay }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
                </div>
                <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Ativo
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                {loading ? (
                    <div className="h-8 w-16 bg-gray-100 animate-pulse rounded" />
                ) : (
                    <h3 className="text-3xl font-bold text-gunmetal-600">{value}</h3>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">

            {/* Cabeçalho de Boas-vindas */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gunmetal-600">
                        Olá, {user?.nome || 'Gestor'}! 👋
                    </h1>
                    <p className="text-gray-500">Aqui está o resumo geral do seu ecossistema SmartCondo.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Sistema Operacional
                </div>
            </div>

            {/* Grid de Estatísticas (Ajustado para 5 colunas em telas grandes) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

                {/* 1. RESERVAS (Novo - Destaque) */}
                <StatCard
                    title="Reservas Agendadas"
                    value={stats.reservas}
                    icon={CalendarCheck}
                    colorClass="bg-pink-500 text-pink-500"
                    delay="0ms"
                />

                {/* 2. AVISOS */}
                <StatCard
                    title="Avisos Ativos"
                    value={stats.avisos}
                    icon={Megaphone}
                    colorClass="bg-orange-500 text-orange-500"
                    delay="100ms"
                />

                {/* 3. CONDOMINIOS */}
                <StatCard
                    title="Condomínios"
                    value={stats.condominios}
                    icon={Building2}
                    colorClass="bg-terracotta-500 text-terracotta-500"
                    delay="200ms"
                />

                {/* 4. UNIDADES */}
                <StatCard
                    title="Unidades Totais"
                    value={stats.unidades}
                    icon={Home}
                    colorClass="bg-blue-500 text-blue-500"
                    delay="300ms"
                />

                {/* 5. PESSOAS */}
                <StatCard
                    title="Pessoas Cadastradas"
                    value={stats.usuarios}
                    icon={Users}
                    colorClass="bg-purple-500 text-purple-500"
                    delay="400ms"
                />
            </div>

            {/* Seção Inferior */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Ações Rápidas */}
                <div className="lg:col-span-1 bg-gradient-to-br from-gunmetal-800 to-gunmetal-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none" />

                    <h3 className="text-lg text-terracotta-400 font-bold mb-6 flex items-center gap-2 relative z-10">
                        <PlusCircle className="w-5 h-5 text-terracotta-400" />
                        Acesso Rápido
                    </h3>

                    <div className="space-y-3 relative z-10">
                        {/* LINK RESERVAS (NOVO) */}
                        <Link
                            href="/dashboard/reservas"
                            className="group flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                                    <CalendarCheck className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-sm text-pink-400">Nova Reserva</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </Link>

                        <Link
                            href="/dashboard/avisos"
                            className="group flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                                    <Megaphone className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-sm text-orange-400">Criar Aviso</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </Link>

                        <Link
                            href="/dashboard/condominios"
                            className="group flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                                    <Building2 className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-sm text-green-400">Novo Condomínio</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </Link>

                        <Link
                            href="/dashboard/unidades"
                            className="group flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                                    <Home className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-sm text-blue-400">Nova Unidade</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </Link>

                        <Link
                            href="/dashboard/usuarios"
                            className="group flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                                    <Users className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-sm text-purple-400">Cadastrar Usuário</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </Link>
                    </div>
                </div>

                {/* Visão Geral (Sem alterações, apenas mantendo layout) */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gunmetal-600 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-gray-400" />
                                Visão Geral do Sistema
                            </h3>
                            <p className="text-sm text-gray-400">Distribuição de recursos cadastrados</p>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1 flex flex-col justify-center">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-gunmetal-600">Ocupação de Condomínios</span>
                                <span className="text-gray-400">{stats.condominios} ativos</span>
                            </div>
                            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-terracotta-500 rounded-full w-[45%]" />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-gunmetal-600">Unidades Preenchidas</span>
                                <span className="text-gray-400">{stats.unidades} cadastradas</span>
                            </div>
                            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full w-[60%]" />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-gunmetal-600">Base de Reservas</span>
                                <span className="text-gray-400">{stats.reservas} agendadas</span>
                            </div>
                            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-pink-500 rounded-full w-[25%]" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}