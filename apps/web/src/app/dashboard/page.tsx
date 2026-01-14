'use client';

import { useEffect, useState } from 'react';
import {
  Building2,
  Home,
  Users,
  Plus,
  ArrowRight,
  Megaphone,
  CalendarCheck,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { condominioService } from '@/services/condominio-service';
import { unidadeService } from '@/services/unidade-service';
import { usuarioService } from '@/services/usuario-service';
import { avisosService } from '@/services/aviso-service';
import { bookingService } from '@/services/booking-service';
import { useToast } from '@/components/ui/toast';
import { AxiosError } from 'axios';

interface DashboardStats {
  condominios: number;
  unidades: number;
  usuarios: number;
  avisos: number;
  reservas: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { error: showError } = useToast();
  
  const [stats, setStats] = useState<DashboardStats>({
    condominios: 0,
    unidades: 0,
    usuarios: 0,
    avisos: 0,
    reservas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [condosResponse, units, users, avisosData, bookingsData] = await Promise.all([
          condominioService.getAll({ page: 1, perPage: 1 }), 
          unidadeService.getAll(),
          usuarioService.getAll(),
          avisosService.getAll(),
          bookingService.getAll()
        ]);

        setStats({
          condominios: condosResponse.meta.total,
          unidades: units.length,
          usuarios: users.length,
          avisos: avisosData.length,
          reservas: bookingsData.length
        });
      } catch (error: unknown) {
        console.error('Erro ao carregar estatísticas:', error);
        
        let message = 'Não foi possível carregar as estatísticas';
        if (error instanceof AxiosError && error.response?.data?.message) {
            message = error.response.data.message;
        }
        
        showError('Erro ao carregar dashboard', message);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [showError]);

  const StatCard = ({ title, value, icon: Icon, delay }: { title: string, value: number, icon: any, delay: string }) => (
    <div 
      className="group bg-white p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-soft transition-all duration-500 ease-out"
      style={{ animationDelay: delay }}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-stone-400 group-hover:text-clay-600 group-hover:bg-clay-50 group-hover:border-clay-100 transition-colors duration-300">
          <Icon className="w-6 h-6" strokeWidth={1.5} />
        </div>
        <MoreHorizontal className="w-5 h-5 text-stone-300 cursor-pointer hover:text-stone-500" />
      </div>
      <div>
        <h3 className="text-4xl font-light text-espresso-900 mb-2 tracking-tight">
          {loading ? <div className="h-10 w-16 bg-stone-100 animate-pulse rounded-md" /> : value}
        </h3>
        <p className="text-sm font-medium text-stone-500 uppercase tracking-wide">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-3xl font-light text-espresso-900">
            Bem-vindo, <span className="font-medium">{user?.name || 'Gestor'}</span>
          </h1>
          <p className="mt-2 text-stone-500 font-light">
            Visão geral de desempenho e atividades recentes.
          </p>
        </div>
        <div className="text-xs font-bold text-clay-600 uppercase tracking-widest bg-clay-50 px-4 py-2 rounded-full border border-clay-100">
           Status: Sistema Operacional
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard title="Reservas" value={stats.reservas} icon={CalendarCheck} delay="0ms" />
        <StatCard title="Avisos" value={stats.avisos} icon={Megaphone} delay="100ms" />
        <StatCard title="Condomínios" value={stats.condominios} icon={Building2} delay="200ms" />
        <StatCard title="Unidades" value={stats.unidades} icon={Home} delay="300ms" />
        <StatCard title="Usuários" value={stats.usuarios} icon={Users} delay="400ms" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-1 bg-espresso-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-xl font-light mb-8 flex items-center gap-3">
              <span className="p-1.5 bg-clay-500 rounded-lg"><Plus className="w-4 h-4 text-white" /></span>
              Ações Rápidas
            </h3>

            <div className="space-y-4">
              {[
                { label: 'Nova Reserva', href: '/dashboard/bookings', icon: CalendarCheck },
                { label: 'Criar Aviso', href: '/dashboard/avisos', icon: Megaphone },
                { label: 'Novo Condomínio', href: '/dashboard/condominios', icon: Building2 },
              ].map((action, idx) => (
                <Link
                  key={idx}
                  href={action.href}
                  className="group flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <action.icon className="w-5 h-5 text-clay-300 group-hover:text-white transition-colors" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-stone-300 group-hover:text-white">{action.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-clay-300 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <Link href="#" className="text-xs text-stone-500 hover:text-clay-300 transition-colors uppercase tracking-widest">
                Precisa de ajuda?
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 p-8 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-semibold text-espresso-900">Ocupação do Sistema</h3>
              <p className="text-sm text-stone-500">Métricas de preenchimento de unidades e cadastros</p>
            </div>
            <button className="text-sm text-clay-600 font-medium hover:text-clay-700">Ver relatório</button>
          </div>

          <div className="space-y-8 flex-1 justify-center py-4">
            {[
              { label: 'Ocupação de Condomínios', total: stats.condominios, max: 100, color: 'bg-clay-500' },
              { label: 'Unidades Preenchidas', total: stats.unidades, max: 200, color: 'bg-espresso-600' },
              { label: 'Reservas do Mês', total: stats.reservas, max: 50, color: 'bg-stone-400' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-medium text-stone-700">{item.label}</span>
                  <span className="text-stone-400 font-mono">{item.total}</span>
                </div>
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} 
                    style={{ width: `${Math.min((item.total / (item.max || 1)) * 100, 100)}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}