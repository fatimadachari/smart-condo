'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Building2, Trash2, Edit2, MapPin, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { condominioService, Condominio, PaginationMeta } from '@/services/condominio-service';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { CondominioFormDialog } from '@/components/features/condominio-form-dialog';
import { useToast } from '@/components/ui/toast';
import { useDebounce } from '@/hooks/use-debounce';
import { DashboardCardSkeleton } from '@/components/ui/skeleton';
import { AxiosError } from 'axios';

interface BackendError {
  message: string;
  statusCode: number;
}

export default function CondominiosPage() {
  const { success, error: showError } = useToast();

  const [condominios, setCondominios] = useState<Condominio[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 9;

  const [condoToDelete, setCondoToDelete] = useState<string | null>(null);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isForceDeleteOpen, setIsForceDeleteOpen] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCondo, setEditingCondo] = useState<Condominio | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await condominioService.getAll({
        page: currentPage,
        perPage,
        search: debouncedSearch || undefined,
      });

      setCondominios(response.data);
      setMeta(response.meta);
    } catch (err) {
      console.error(err);
      showError('Erro', 'Não foi possível carregar a lista de condomínios.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, perPage, showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenNew = () => {
    setEditingCondo(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (condo: Condominio) => {
    setEditingCondo(condo);
    setIsFormOpen(true);
  };

  const handleFormSuccess = (savedCondo: Condominio) => {
    if (editingCondo) {
      setCondominios(prev => prev.map(c => c.id === savedCondo.id ? savedCondo : c));
      success('Atualizado', 'Condomínio atualizado com sucesso.');
    } else {
      loadData();
      success('Criado', 'Novo condomínio cadastrado com sucesso.');
    }
  };

  const handleInitialDelete = (id: string) => {
    setCondoToDelete(id);
    setIsDeleteOpen(true);
  };

  const confirmStandardDelete = async () => {
    if (!condoToDelete) return;
    setIsProcessingDelete(true);

    try {
      await condominioService.delete(condoToDelete, false);

      setIsDeleteOpen(false);
      setCondoToDelete(null);
      loadData(); 
      success('Excluído', 'Condomínio removido com sucesso.');

    } catch (err: unknown) {
      const axiosError = err as AxiosError<BackendError>;
      const errorMessage = axiosError.response?.data?.message;

      if (errorMessage === 'EXIST_DEPENDENCY') {
        setIsDeleteOpen(false);
        setIsForceDeleteOpen(true); 
      } else {
        showError('Erro ao excluir', errorMessage || 'Não foi possível completar a ação.');
        setIsDeleteOpen(false);
      }
    } finally {
      setIsProcessingDelete(false);
    }
  };

  const confirmForceDelete = async () => {
    if (!condoToDelete) return;
    setIsProcessingDelete(true);

    try {
      await condominioService.delete(condoToDelete, true); 

      setIsForceDeleteOpen(false);
      setCondoToDelete(null);
      loadData();
      success('Excluído em Cascata', 'Condomínio e todas as dependências foram removidos.');
    } catch (err: unknown) {
      const axiosError = err as AxiosError<BackendError>;
      showError('Erro Crítico', axiosError.response?.data?.message || 'Falha na exclusão forçada.');
    } finally {
      setIsProcessingDelete(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-light text-espresso-900 tracking-tight">
            Gestão de <span className="font-semibold">Condomínios</span>
          </h1>
          <p className="mt-2 text-stone-500 font-light">Administre seu portfólio de empreendimentos.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-clay-500 transition-colors" />
            <input
              type="text"
              placeholder="Buscar condomínio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100 transition-all shadow-sm placeholder-stone-400"
            />
          </div>

          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 bg-espresso-800 hover:bg-espresso-900 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-stone-200 hover:shadow-xl hover:-translate-y-0.5 group active:translate-y-0"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium tracking-wide">Novo</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <DashboardCardSkeleton key={i} />)}
        </div>
      ) : condominios.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-stone-100 shadow-sm flex flex-col items-center">
          <div className="p-4 bg-stone-50 rounded-full mb-4 border border-stone-100">
            <Building2 className="w-8 h-8 text-stone-300" />
          </div>
          <h3 className="text-lg font-medium text-espresso-800">Nenhum condomínio encontrado</h3>
          <p className="text-stone-400 mt-1">
            {debouncedSearch ? `Sem resultados para "${debouncedSearch}".` : 'Comece cadastrando o primeiro empreendimento.'}
          </p>
          {debouncedSearch && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-clay-600 hover:text-clay-700 text-sm font-medium hover:underline"
            >
              Limpar busca
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {condominios.map((condo, index) => (
              <div
                key={condo.id}
                className="group relative bg-white rounded-2xl border border-stone-100 p-8 shadow-sm hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-stone-50 rounded-xl text-stone-400 group-hover:text-clay-600 group-hover:bg-clay-50 transition-colors duration-300 border border-transparent group-hover:border-clay-100/50">
                    <Building2 className="w-6 h-6" strokeWidth={1.5} />
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleOpenEdit(condo)}
                      className="p-2 text-stone-400 hover:text-clay-600 hover:bg-stone-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleInitialDelete(condo.id)}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-espresso-900 mb-2 truncate">{condo.nome}</h3>

                <div className="flex items-start gap-2 text-stone-500 text-sm font-light mt-4 pt-4 border-t border-stone-50">
                  <MapPin className="w-4 h-4 mt-0.5 text-clay-400 shrink-0" />
                  <span className="leading-relaxed line-clamp-2">{condo.endereco || 'Endereço não informado'}</span>
                </div>
              </div>
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-stone-100 gap-4">
              <div className="text-sm text-stone-500">
                Mostrando <span className="font-medium text-espresso-800">{condominios.length}</span> de{' '}
                <span className="font-medium text-espresso-800">{meta.total}</span> condomínios
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={!meta.hasPrevPage}
                  className="p-2 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-espresso-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="px-4 py-2 text-sm font-medium text-espresso-800 bg-stone-50 rounded-lg border border-stone-100">
                  Página {meta.page} de {meta.totalPages}
                </div>

                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={!meta.hasNextPage}
                  className="p-2 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-espresso-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <CondominioFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        condominioToEdit={editingCondo}
      />

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmStandardDelete}
        title="Excluir Condomínio"
        description="Tem certeza que deseja remover este condomínio? A ação não poderá ser desfeita."
        confirmText="Sim, excluir"
        variant="danger"
        isLoading={isProcessingDelete}
      />

      <ConfirmationDialog
        isOpen={isForceDeleteOpen}
        onClose={() => {
          setIsForceDeleteOpen(false);
          setCondoToDelete(null);
        }}
        onConfirm={confirmForceDelete}
        title="⚠️ Dependências Encontradas"
        description={
          <div className="space-y-3">
            <p>Não foi possível excluir pois existem <strong>Moradores</strong>, <strong>Unidades</strong> ou <strong>Avisos</strong> vinculados.</p>
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm flex gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p>Deseja forçar a exclusão? Isso apagará <strong>TODOS</strong> os dados vinculados permanentemente.</p>
            </div>
          </div>
        }
        confirmText="Confirmar Exclusão Total"
        variant="danger"
        isLoading={isProcessingDelete}
        countdown={5} 
      />
    </div>
  );
}