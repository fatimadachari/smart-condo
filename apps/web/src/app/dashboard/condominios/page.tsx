'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Building2, Trash2, Edit2, Loader2, MapPin, MoreHorizontal } from 'lucide-react';
import { condominioService, Condominio } from '@/services/condominio-service';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { CondominioFormDialog } from '@/components/features/condominio-form-dialog';

export default function CondominiosPage() {
  const [condominios, setCondominios] = useState<Condominio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados de Exclusão e Edição
  const [condoToDelete, setCondoToDelete] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isForceDeleteOpen, setIsForceDeleteOpen] = useState(false);
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
    } else {
      setCondominios(prev => [savedCondo, ...prev]);
    }
  };

  const handleInitialDelete = (id: string) => {
    setCondoToDelete(id);
    setIsDeleteOpen(true);
  };

  const confirmStandardDelete = async () => {
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

  const confirmForceDelete = async () => {
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

  const filteredCondominios = condominios.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.endereco?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Actions */}
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
                    className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100 transition-all shadow-sm"
                />
            </div>
            
            <button 
                onClick={handleOpenNew}
                className="flex items-center gap-2 bg-espresso-800 hover:bg-espresso-900 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-stone-200 hover:shadow-xl hover:-translate-y-0.5 group"
            >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-medium tracking-wide">Novo</span>
            </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="w-8 h-8 text-clay-400 animate-spin" />
        </div>
      ) : filteredCondominios.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-stone-100 shadow-sm flex flex-col items-center">
          <div className="p-4 bg-stone-50 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-stone-300" />
          </div>
          <h3 className="text-lg font-medium text-espresso-800">Nenhum condomínio encontrado</h3>
          <p className="text-stone-400 mt-1">Comece cadastrando o primeiro empreendimento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCondominios.map((condo, index) => (
            <div 
                key={condo.id} 
                className="group relative bg-white rounded-2xl border border-stone-100 p-8 shadow-sm hover:shadow-soft transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
            >
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-stone-50 rounded-xl text-stone-400 group-hover:text-clay-600 group-hover:bg-clay-50 transition-colors duration-300">
                        <Building2 className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button 
                            onClick={() => handleOpenEdit(condo)}
                            className="p-2 text-stone-400 hover:text-clay-600 hover:bg-stone-50 rounded-lg transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleInitialDelete(condo.id)}
                            className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-espresso-900 mb-2">{condo.nome}</h3>
                
                <div className="flex items-start gap-2 text-stone-500 text-sm font-light mt-4 pt-4 border-t border-stone-50">
                    <MapPin className="w-4 h-4 mt-0.5 text-clay-400" />
                    <span className="leading-relaxed">{condo.endereco || 'Endereço não informado'}</span>
                </div>
            </div>
          ))}
        </div>
      )}

      {/* Modais mantidos */}
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
        isLoading={isProcessing}
      />

      <ConfirmationDialog 
        isOpen={isForceDeleteOpen}
        onClose={() => {
          setIsForceDeleteOpen(false);
          setCondoToDelete(null);
        }}
        onConfirm={confirmForceDelete}
        title="⚠️ Ação Crítica"
        description="Este condomínio possui MORADORES e UNIDADES vinculados. Excluir apagará TODOS esses dados permanentemente."
        confirmText="Confirmar Exclusão Total"
        variant="danger"
        isLoading={isProcessing}
        countdown={5}
      />
    </div>
  );
}