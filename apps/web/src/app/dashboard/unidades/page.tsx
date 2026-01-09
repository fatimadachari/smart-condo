'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Home, Trash2, Edit2, Loader2, Building } from 'lucide-react';
import { unidadeService, Unidade } from '@/services/unidade-service';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { UnidadeFormDialog } from '@/components/features/unidade-form-dialog';

export default function UnidadesPage() {
    const [unidades, setUnidades] = useState<Unidade[]>([]);
    const [loading, setLoading] = useState(true);

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

    // Form Handlers
    const handleOpenNew = () => {
        setEditingUnidade(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (unidade: Unidade) => {
        setEditingUnidade(unidade);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        // Simplesmente recarregamos tudo para garantir que os relacionamentos venham certos
        loadData();
    };

    // Delete Handlers
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gunmetal-600 flex items-center gap-2">
                        <Home className="w-8 h-8 text-terracotta-500" />
                        Gestão de Unidades
                    </h1>
                    <p className="text-gray-500">Cadastre apartamentos, casas e salas comerciais.</p>
                </div>
                <button
                    onClick={handleOpenNew}
                    className="flex items-center gap-2 bg-terracotta-500 text-white px-5 py-2.5 rounded-lg hover:bg-terracotta-600 transition-colors shadow-glow font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Nova Unidade
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Buscar unidade..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500/20" />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-terracotta-500 animate-spin" /></div>
            ) : unidades.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gunmetal-600">Nenhuma unidade encontrada</h3>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Identificação</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Bloco</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Condomínio</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {unidades.map((uni) => (
                                <tr key={uni.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-gunmetal-600">{uni.identificacao}</td>
                                    <td className="px-6 py-4 text-gray-500">{uni.bloco || '-'}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Building className="w-4 h-4 text-terracotta-400" />
                                            {uni.condominio?.nome || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenEdit(uni)} className="p-2 text-gray-400 hover:text-terracotta-500 hover:bg-terracotta-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => { setUnidadeToDelete(uni.id); setIsDeleteOpen(true); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                description="Tem certeza?"
                confirmText="Sim, excluir"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}