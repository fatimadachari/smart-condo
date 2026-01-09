'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Building2, Trash2, Edit2, Loader2, MapPin } from 'lucide-react';
import { condominioService, Condominio } from '@/services/condominio-service';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
// 1. IMPORTAR O NOVO FORMULÁRIO
import { CondominioFormDialog } from '@/components/features/condominio-form-dialog';

export default function CondominiosPage() {
  const [condominios, setCondominios] = useState<Condominio[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de Exclusão
  const [condoToDelete, setCondoToDelete] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isForceDeleteOpen, setIsForceDeleteOpen] = useState(false);

  // 2. NOVOS ESTADOS PARA O FORMULÁRIO
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCondo, setEditingCondo] = useState<Condominio | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await condominioService.getAll();
      setCondominios(data);
    } catch (error) {
      console.error('Erro ao carregar dados', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- LÓGICA DO FORMULÁRIO ---
  
  // Abrir para CRIAR
  const handleOpenNew = () => {
    setEditingCondo(null);
    setIsFormOpen(true);
  };

  // Abrir para EDITAR
  const handleOpenEdit = (condo: Condominio) => {
    setEditingCondo(condo);
    setIsFormOpen(true);
  };

  // Callback de Sucesso (Chamado pelo Modal quando salva)
  const handleFormSuccess = (savedCondo: Condominio) => {
    if (editingCondo) {
      // Se estava editando, atualiza o item na lista
      setCondominios(prev => prev.map(c => c.id === savedCondo.id ? savedCondo : c));
    } else {
      // Se estava criando, adiciona no topo da lista
      setCondominios(prev => [savedCondo, ...prev]);
    }
  };

  // --- LÓGICA DE EXCLUSÃO (Mantenha igual) ---
  const handleInitialDelete = (id: string) => {
    setCondoToDelete(id);
    setIsDeleteOpen(true);
  };

  const confirmStandardDelete = async () => { /* ... código igual ao anterior ... */ 
    if (!condoToDelete) return;
    setIsProcessing(true);
    try {
      await condominioService.delete(condoToDelete, false);
      setCondominios(prev => prev.filter(c => c.id !== condoToDelete));
      setIsDeleteOpen(false);
      setCondoToDelete(null);
    } catch (error: any) {
      if (error.response?.data?.message === 'EXIST_DEPENDENCY') {
        setIsDeleteOpen(false);
        setIsForceDeleteOpen(true);
      } else {
        alert('Erro inesperado.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmForceDelete = async () => { /* ... código igual ao anterior ... */
    if (!condoToDelete) return;
    setIsProcessing(true);
    try {
      await condominioService.delete(condoToDelete, true);
      setCondominios(prev => prev.filter(c => c.id !== condoToDelete));
      setIsForceDeleteOpen(false);
      setCondoToDelete(null);
    } catch (error) {
      alert('Erro crítico.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gunmetal-600 flex items-center gap-2">
            <Building2 className="w-8 h-8 text-terracotta-500" />
            Gestão de Condomínios
          </h1>
          <p className="text-gray-500">Administre os empreendimentos cadastrados no sistema.</p>
        </div>

        {/* 3. ATUALIZAR O BOTÃO NOVO */}
        <button 
          onClick={handleOpenNew}
          className="flex items-center gap-2 bg-terracotta-500 text-white px-5 py-2.5 rounded-lg hover:bg-terracotta-600 transition-colors shadow-glow font-medium"
        >
          <Plus className="w-5 h-5" />
          Novo Condomínio
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou endereço..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-terracotta-500 animate-spin" />
        </div>
      ) : condominios.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gunmetal-600">Nenhum condomínio encontrado</h3>
          <p className="text-gray-500">Comece cadastrando o primeiro empreendimento.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Endereço</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {condominios.map((condo) => (
                <tr key={condo.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gunmetal-600">{condo.nome}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {condo.endereco || 'Sem endereço cadastrado'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      
                      {/* 4. ATUALIZAR O BOTÃO EDITAR */}
                      <button 
                        onClick={() => handleOpenEdit(condo)}
                        className="p-2 text-gray-400 hover:text-terracotta-500 hover:bg-terracotta-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      
                      <button 
                        onClick={() => handleInitialDelete(condo.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODAL DE FORMULÁRIO (NOVO/EDITAR) --- */}
      <CondominioFormDialog 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        condominioToEdit={editingCondo}
      />

      {/* --- MODAIS DE CONFIRMAÇÃO (MANTER) --- */}
      <ConfirmationDialog 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmStandardDelete}
        title="Excluir Condomínio"
        description="Tem certeza que deseja remover este condomínio? A ação não poderá ser desfeita."
        confirmText="Sim, excluir"
        variant="danger"
        isLoading={isProcessing}
      />

      <ConfirmationDialog 
        isOpen={isForceDeleteOpen}
        onClose={() => {
          setIsForceDeleteOpen(false);
          setCondoToDelete(null);
        }}
        onConfirm={confirmForceDelete}
        title="⚠️ Ação Destrutiva"
        description="Este condomínio possui MORADORES e UNIDADES vinculados. Se continuar, TODOS esses dados serão apagados permanentemente."
        confirmText="Entendo os riscos, excluir tudo"
        variant="danger"
        isLoading={isProcessing}
        countdown={5}
      />
    </div>
  );
}