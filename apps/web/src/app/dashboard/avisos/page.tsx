'use client';

import { useEffect, useState } from 'react';
import { 
    Plus, 
    Search, 
    Megaphone, 
    Trash2, 
    Loader2, 
    Calendar, 
    AlertCircle, 
    Info, 
    Pencil,
    MoreHorizontal,
    Pin
} from 'lucide-react';
import { avisosService, Aviso } from '@/services/aviso-service';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { AvisoFormDialog } from '@/components/features/aviso-form-dialog';

export default function AvisosPage() {
    const [avisos, setAvisos] = useState<Aviso[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados de Exclusão e Edição
    const [avisoToDelete, setAvisoToDelete] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAviso, setEditingAviso] = useState<Aviso | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await avisosService.getAll();
            setAvisos(data);
        } catch (error) {
            console.error('Erro ao carregar avisos', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleOpenNew = () => {
        setEditingAviso(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (aviso: Aviso) => {
        setEditingAviso(aviso);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        loadData();
    };

    const handleInitialDelete = (id: string) => {
        setAvisoToDelete(id);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!avisoToDelete) return;
        setIsProcessing(true);
        try {
            await avisosService.delete(avisoToDelete);
            setAvisos(prev => prev.filter(a => a.id !== avisoToDelete));
            setIsDeleteOpen(false);
            setAvisoToDelete(null);
        } catch (error) {
            alert('Erro ao excluir aviso.');
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredAvisos = avisos.filter(a =>
        a.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header & Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-light text-espresso-900 tracking-tight">
                        Mural de <span className="font-semibold">Comunicados</span>
                    </h1>
                    <p className="mt-2 text-stone-500 font-light max-w-lg">
                        Mantenha a comunidade informada. Gerencie ocorrências, avisos de manutenção e eventos sociais.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Barra de Busca Estilizada */}
                    <div className="relative group flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-clay-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar avisos..."
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
                        <span className="font-medium tracking-wide">Novo Aviso</span>
                    </button>
                </div>
            </div>

            {/* Grid de Conteúdo */}
            {loading ? (
                <div className="flex justify-center py-32">
                    <Loader2 className="w-8 h-8 text-clay-400 animate-spin" />
                </div>
            ) : filteredAvisos.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-stone-100 shadow-sm flex flex-col items-center">
                    <div className="p-4 bg-stone-50 rounded-full mb-4">
                        <Megaphone className="w-8 h-8 text-stone-300" />
                    </div>
                    <h3 className="text-lg font-medium text-espresso-800">O mural está vazio</h3>
                    <p className="text-stone-400 mt-1 max-w-xs mx-auto">Nenhum aviso encontrado. Crie o primeiro comunicado para informar os moradores.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredAvisos.map((aviso, index) => {
                        const isUrgente = aviso.tipo === 'URGENTE';
                        
                        return (
                            <div 
                                key={aviso.id} 
                                className="group relative bg-white rounded-2xl border border-stone-100 p-6 shadow-sm hover:shadow-soft transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[220px]"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Padrão decorativo no topo (Opcional) */}
                                <div className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl ${isUrgente ? 'bg-red-400' : 'bg-clay-200'}`} />

                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        {/* Badge de Tipo */}
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                            isUrgente 
                                                ? 'bg-red-50 text-red-600 border-red-100' 
                                                : 'bg-stone-50 text-stone-500 border-stone-100'
                                        }`}>
                                            {isUrgente ? <AlertCircle className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                                            {aviso.tipo}
                                        </span>

                                        {/* Menu de Ações (Aparece no Hover) */}
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button 
                                                onClick={() => handleOpenEdit(aviso)}
                                                className="p-1.5 text-stone-400 hover:text-clay-600 hover:bg-stone-50 rounded-lg transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleInitialDelete(aviso.id)}
                                                className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold text-espresso-900 mb-3 leading-tight line-clamp-2 group-hover:text-clay-700 transition-colors">
                                        {aviso.titulo}
                                    </h3>
                                    
                                    <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 mb-6 font-light">
                                        {aviso.descricao}
                                    </p>
                                </div>

                                {/* Rodapé do Card */}
                                <div className="pt-4 border-t border-stone-50 flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2 text-xs font-medium text-stone-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {aviso.dataEvento ? (
                                            <span className="text-clay-600">
                                                Evento: {new Date(aviso.dataEvento).toLocaleDateString('pt-BR')}
                                            </span>
                                        ) : (
                                            <span>
                                                Postado em {new Date(aviso.criadoEm || '').toLocaleDateString('pt-BR')}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Ícone de Pin decorativo */}
                                    <Pin className="w-3.5 h-3.5 text-stone-200 rotate-45" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- MANTER MODAIS ORIGINAIS --- */}
            <AvisoFormDialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleFormSuccess}
                avisoToEdit={editingAviso}
            />

            <ConfirmationDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                title="Excluir Aviso"
                description="Tem certeza que deseja remover este comunicado do mural? Esta ação é irreversível."
                confirmText="Sim, remover"
                variant="danger"
                isLoading={isProcessing}
            />
        </div>
    );
}