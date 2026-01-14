'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
    Plus, 
    Search, 
    Trash2, 
    Pencil,
    Users,
    XCircle,
    Coffee,
    AlertTriangle
} from 'lucide-react';
import { commonAreaService, CommonArea } from '@/services/common-area-service';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'; 
import { CommonAreaFormDialog } from '@/components/features/common-area-form-dialog'; 
import { useToast } from '@/components/ui/toast';
import { useDebounce } from '@/hooks/use-debounce';
import { DashboardCardSkeleton } from '@/components/ui/skeleton';
import { AxiosError } from 'axios';

interface BackendError {
  message: string;
}

export default function CommonAreasPage() {
    const { success, error: showError } = useToast();

    const [areas, setAreas] = useState<CommonArea[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);

    const [areaToDelete, setAreaToDelete] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isForceDeleteOpen, setIsForceDeleteOpen] = useState(false);
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingArea, setEditingArea] = useState<CommonArea | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await commonAreaService.getAll();
            setAreas(data);
        } catch (error) {
            console.error(error);
            showError('Erro', 'Não foi possível carregar as áreas comuns.');
        } finally {
            setLoading(false);
        }
    }, [showError]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleOpenNew = () => {
        setEditingArea(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (area: CommonArea) => {
        setEditingArea(area);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        loadData();
        success('Sucesso', editingArea ? 'Área atualizada.' : 'Área criada.');
    };

    const handleInitialDelete = (id: string) => {
        setAreaToDelete(id);
        setIsDeleteOpen(true);
    };

    const confirmStandardDelete = async () => {
        if (!areaToDelete) return;
        setIsProcessing(true);
        try {
            await commonAreaService.delete(areaToDelete, false);
            setAreas(prev => prev.filter(a => a.id !== areaToDelete));
            setIsDeleteOpen(false);
            setAreaToDelete(null);
            success('Excluído', 'Área removida com sucesso.');
        } catch (err: unknown) {
            const error = err as AxiosError<BackendError>;
            if (error.response?.data?.message === 'EXIST_DEPENDENCY') {
                setIsDeleteOpen(false);
                setIsForceDeleteOpen(true);
            } else {
                showError('Erro', 'Falha ao excluir área.');
                setIsDeleteOpen(false);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const confirmForceDelete = async () => {
        if (!areaToDelete) return;
        setIsProcessing(true);
        try {
            await commonAreaService.delete(areaToDelete, true);
            setAreas(prev => prev.filter(a => a.id !== areaToDelete));
            setIsForceDeleteOpen(false);
            setAreaToDelete(null);
            success('Excluído', 'Área e reservas associadas removidas.');
        } catch (error) {
            console.error(error);
            showError('Erro Crítico', 'Falha na exclusão forçada.');
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredAreas = areas.filter(a =>
        a.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-light text-espresso-900 tracking-tight">
                        Gestão de <span className="font-semibold">Áreas Comuns</span>
                    </h1>
                    <p className="mt-2 text-stone-500 font-light">Espaços compartilhados e lazer.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative group flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-clay-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar área..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100 transition-all shadow-sm placeholder-stone-400"
                        />
                    </div>
                    
                    <button
                        onClick={handleOpenNew}
                        className="flex items-center gap-2 bg-espresso-800 hover:bg-espresso-900 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-stone-200 hover:shadow-xl hover:-translate-y-0.5 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="font-medium tracking-wide">Nova Área</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {[...Array(6)].map((_, i) => <DashboardCardSkeleton key={i} />)}
                </div>
            ) : filteredAreas.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-stone-100 shadow-sm flex flex-col items-center">
                    <div className="p-4 bg-stone-50 rounded-full mb-4 border border-stone-100">
                        <Coffee className="w-8 h-8 text-stone-300" />
                    </div>
                    <h3 className="text-lg font-medium text-espresso-800">Nenhuma área encontrada</h3>
                    <p className="text-stone-400 mt-1">
                        {debouncedSearch ? 'Tente outra busca.' : 'Cadastre o salão de festas, academia ou piscina.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAreas.map((area, index) => (
                        <div 
                            key={area.id} 
                            className="group relative bg-white rounded-2xl border border-stone-100 p-6 shadow-sm hover:shadow-soft transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[220px]"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2.5 bg-stone-50 rounded-xl text-clay-600 group-hover:bg-clay-500 group-hover:text-white transition-colors duration-300">
                                        <Coffee className="w-6 h-6" strokeWidth={1.5} />
                                    </div>
                                    
                                    {area.isActive ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 uppercase tracking-widest">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Disp.
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500 border border-stone-200 uppercase tracking-widest">
                                            <XCircle className="w-3 h-3" /> Manut.
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-semibold text-espresso-900 mb-2 truncate">{area.name}</h3>
                                <p className="text-sm text-stone-500 font-light line-clamp-2 mb-4 h-10">
                                    {area.description || <span className="italic opacity-50">Sem descrição definida.</span>}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-stone-50 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-stone-400 text-sm">
                                    <Users className="w-4 h-4" />
                                    <span className="font-medium text-stone-600">{area.capacity} pessoas</span>
                                </div>

                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button 
                                        onClick={() => handleOpenEdit(area)}
                                        className="p-2 text-stone-400 hover:text-clay-600 hover:bg-stone-50 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleInitialDelete(area.id)}
                                        className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CommonAreaFormDialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleFormSuccess}
                areaToEdit={editingArea}
            />

            <ConfirmationDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmStandardDelete}
                title="Excluir Área Comum"
                description="Deseja remover este espaço? O histórico não poderá ser recuperado."
                confirmText="Sim, remover"
                variant="danger"
                isLoading={isProcessing}
            />

            <ConfirmationDialog 
                isOpen={isForceDeleteOpen}
                onClose={() => {
                    setIsForceDeleteOpen(false);
                    setAreaToDelete(null);
                }}
                onConfirm={confirmForceDelete}
                title="⚠️ Reservas Existentes"
                description={
                    <div className="space-y-3">
                        <p>Não é possível excluir pois existem <strong>Reservas</strong> agendadas para este local.</p>
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm flex gap-2">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <p>Deseja forçar a exclusão? Isso cancelará e apagará <strong>TODAS</strong> as reservas vinculadas.</p>
                        </div>
                    </div>
                }
                confirmText="Confirmar Exclusão Total"
                variant="danger"
                isLoading={isProcessing}
                countdown={5}
            />
        </div>
    );
}