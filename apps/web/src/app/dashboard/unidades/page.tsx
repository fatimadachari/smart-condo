'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Home, Trash2, Edit2, Loader2, Building, Layers } from 'lucide-react';
import { unidadeService, Unidade } from '@/services/unidade-service';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { UnidadeFormDialog } from '@/components/features/unidade-form-dialog';

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados de Modais
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUnidade, setEditingUnidade] = useState<Unidade | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [unidadeToDelete, setUnidadeToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await unidadeService.getAll();
      setUnidades(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNew = () => {
    setEditingUnidade(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (unidade: Unidade) => {
    setEditingUnidade(unidade);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    loadData();
  };

  const confirmDelete = async () => {
    if (!unidadeToDelete) return;
    setIsDeleting(true);
    try {
      await unidadeService.delete(unidadeToDelete);
      setUnidades(prev => prev.filter(u => u.id !== unidadeToDelete));
      setIsDeleteOpen(false);
    } catch (error) {
      alert('Erro ao excluir unidade');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUnidades = unidades.filter(u => 
    u.identificacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.condominio?.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-light text-espresso-900 tracking-tight">
            Gestão de <span className="font-semibold">Unidades</span>
          </h1>
          <p className="mt-2 text-stone-500 font-light">Controle de apartamentos e salas comerciais.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-clay-500 transition-colors" />
                <input type="text" placeholder="Buscar unidade..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100 transition-all shadow-sm" />
            </div>
            <button onClick={handleOpenNew} className="flex items-center gap-2 bg-espresso-800 hover:bg-espresso-900 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-stone-200 hover:shadow-xl hover:-translate-y-0.5 group">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-medium tracking-wide">Nova Unidade</span>
            </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 text-clay-400 animate-spin" /></div>
      ) : filteredUnidades.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-stone-100 shadow-sm flex flex-col items-center">
          <div className="p-4 bg-stone-50 rounded-full mb-4"><Home className="w-8 h-8 text-stone-300" /></div>
          <h3 className="text-lg font-medium text-espresso-800">Nenhuma unidade encontrada</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredUnidades.map((uni, index) => (
                <div 
                    key={uni.id} 
                    className="group bg-white rounded-xl border border-stone-100 p-5 shadow-sm hover:shadow-md hover:border-clay-100 transition-all duration-300 flex flex-col justify-between"
                    style={{ animationDelay: `${index * 30}ms` }}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-xs font-bold text-clay-600 uppercase tracking-widest">Unidade</span>
                            <h3 className="text-2xl font-light text-espresso-900 mt-1">{uni.identificacao}</h3>
                            {uni.bloco && (
                                <div className="flex items-center gap-1 text-sm text-stone-400 mt-1">
                                    <Layers className="w-3 h-3" /> Bloco {uni.bloco}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                             <button onClick={() => handleOpenEdit(uni)} className="p-1.5 text-stone-400 hover:text-clay-600 hover:bg-stone-50 rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                             <button onClick={() => { setUnidadeToDelete(uni.id); setIsDeleteOpen(true); }} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-stone-50 flex items-center gap-2 text-stone-500 text-xs font-medium">
                        <Building className="w-3 h-3 text-stone-300" />
                        <span className="truncate">{uni.condominio?.nome || 'Sem condomínio'}</span>
                    </div>
                </div>
            ))}
        </div>
      )}

      <UnidadeFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        unidadeToEdit={editingUnidade}
      />

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Unidade"
        description="Tem certeza que deseja excluir esta unidade?"
        confirmText="Sim, excluir"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}