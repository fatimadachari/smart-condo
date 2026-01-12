'use client';

import { useEffect, useState } from 'react';
import { 
    Plus, 
    Search, 
    Building, 
    Trash2, 
    Loader2, 
    Pencil,
    Users,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { commonAreaService, CommonArea } from '@/services/common-area-service';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'; 
import { CommonAreaFormDialog } from '@/components/features/common-area-form-dialog'; 

export default function CommonAreasPage() {
    const [areas, setAreas] = useState<CommonArea[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados de Ação
    const [areaToDelete, setAreaToDelete] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    
    // Controle de Deleção Forçada (caso existam reservas)
    const [forceDeleteMode, setForceDeleteMode] = useState(false);

    // Form
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingArea, setEditingArea] = useState<CommonArea | null>(null);

    // Filtro
    const [searchTerm, setSearchTerm] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await commonAreaService.getAll();
            setAreas(data);
        } catch (error) {
            console.error('Erro ao carregar áreas', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // --- HANDLERS ---
    const handleOpenNew = () => {
        setEditingArea(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (area: CommonArea) => {
        setEditingArea(area);
        setIsFormOpen(true);
    };

    const handleInitialDelete = (id: string) => {
        setAreaToDelete(id);
        setForceDeleteMode(false); // Reset modo força
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!areaToDelete) return;
        setIsProcessing(true);
        try {
            // Tenta deletar normal primeiro (force = false)
            // Se estiver no modo forçado (segunda tentativa), force = true
            await commonAreaService.delete(areaToDelete, forceDeleteMode);
            
            setAreas(prev => prev.filter(a => a.id !== areaToDelete));
            setIsDeleteOpen(false);
            setAreaToDelete(null);
            setForceDeleteMode(false);
        } catch (error: any) {
            // Se o backend responder que tem dependências (reservas)
            if (error.response?.data?.message === 'EXIST_DEPENDENCY') {
                setForceDeleteMode(true); // Ativa modo força para a próxima tentativa (UI muda texto)
                return; // Não fecha o modal, deixa o usuário confirmar novamente
            }
            alert('Erro ao excluir área.');
            setIsDeleteOpen(false);
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredAreas = areas.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gunmetal-600 flex items-center gap-2">
                        <Building className="w-8 h-8 text-terracotta-500" />
                        Áreas Comuns
                    </h1>
                    <p className="text-gray-500">Cadastre os espaços disponíveis para reserva no condomínio.</p>
                </div>

                <button
                    onClick={handleOpenNew}
                    className="flex items-center gap-2 bg-terracotta-500 text-white px-5 py-2.5 rounded-lg hover:bg-terracotta-600 transition-colors shadow-glow font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Nova Área
                </button>
            </div>

            {/* Barra de Busca */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome do espaço..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                    />
                </div>
            </div>

            {/* Tabela */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-terracotta-500 animate-spin" />
                </div>
            ) : filteredAreas.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gunmetal-600">Nenhuma área cadastrada</h3>
                    <p className="text-gray-500">Adicione o Salão de Festas, Academia, etc.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome do Espaço</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Capacidade</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAreas.map((area) => (
                                <tr key={area.id} className="hover:bg-gray-50 transition-colors group">
                                    
                                    {/* Nome e Descrição */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gunmetal-600 text-base">{area.name}</span>
                                            {area.description && (
                                                <span className="text-xs text-gray-400 line-clamp-1">{area.description}</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Capacidade */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span>{area.capacity} pessoas</span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        {area.isActive ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                                <CheckCircle2 className="w-3 h-3" /> Disponível
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200">
                                                <XCircle className="w-3 h-3" /> Manutenção
                                            </span>
                                        )}
                                    </td>

                                    {/* Ações */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenEdit(area)}
                                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleInitialDelete(area.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Excluir"
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

            {/* Modais */}
            <CommonAreaFormDialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={loadData}
                areaToEdit={editingArea}
            />

            {/* Dialogo Inteligente de Exclusão */}
            <ConfirmationDialog
                isOpen={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setForceDeleteMode(false); }}
                onConfirm={confirmDelete}
                title={forceDeleteMode ? "ATENÇÃO: Existem Reservas!" : "Excluir Área Comum"}
                description={
                    forceDeleteMode 
                    ? "Esta área possui reservas agendadas. Se você confirmar, TODAS as reservas associadas serão canceladas e apagadas permanentemente. Deseja continuar?" 
                    : "Tem certeza que deseja remover este espaço? Ele não poderá mais ser reservado."
                }
                confirmText={forceDeleteMode ? "Sim, apagar tudo" : "Sim, remover"}
                variant="danger"
                isLoading={isProcessing}
            />
        </div>
    );
}