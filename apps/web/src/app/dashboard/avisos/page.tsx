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
    Pencil 
} from 'lucide-react';
import { avisosService, Aviso } from '@/services/aviso-service';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'; // Ajuste o import conforme seu projeto
import { AvisoFormDialog } from '@/components/features/aviso-form-dialog'; // Ajuste o import conforme seu projeto

export default function AvisosPage() {
    const [avisos, setAvisos] = useState<Aviso[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados de Exclusão
    const [avisoToDelete, setAvisoToDelete] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Estados do Formulário (Criação e Edição)
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAviso, setEditingAviso] = useState<Aviso | null>(null);

    // Filtro
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

    // --- LÓGICA DO FORMULÁRIO ---
    const handleOpenNew = () => {
        setEditingAviso(null); // Garante que não tem nada selecionado
        setIsFormOpen(true);
    };

    const handleOpenEdit = (aviso: Aviso) => {
        setEditingAviso(aviso); // Carrega os dados do aviso clicado
        setIsFormOpen(true);
    };

    const handleFormSuccess = (savedAviso: Aviso) => {
        // Recarrega tudo para garantir a ordem correta vinda do backend
        loadData();
    };

    // --- LÓGICA DE EXCLUSÃO ---
    const handleInitialDelete = (id: string) => {
        setAvisoToDelete(id);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!avisoToDelete) return;
        setIsProcessing(true);
        try {
            await avisosService.delete(avisoToDelete);
            // Remove da lista localmente para ser mais rápido
            setAvisos(prev => prev.filter(a => a.id !== avisoToDelete));
            setIsDeleteOpen(false);
            setAvisoToDelete(null);
        } catch (error) {
            alert('Erro ao excluir aviso.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Filtragem local
    const filteredAvisos = avisos.filter(a =>
        a.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gunmetal-600 flex items-center gap-2">
                        <Megaphone className="w-8 h-8 text-terracotta-500" />
                        Mural de Avisos
                    </h1>
                    <p className="text-gray-500">Gerencie as comunicações e ocorrências do condomínio.</p>
                </div>

                <button
                    onClick={handleOpenNew}
                    className="flex items-center gap-2 bg-terracotta-500 text-white px-5 py-2.5 rounded-lg hover:bg-terracotta-600 transition-colors shadow-glow font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Novo Aviso
                </button>
            </div>

            {/* Barra de Busca */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por título ou descrição..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                    />
                </div>
            </div>

            {/* Tabela de Dados */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-terracotta-500 animate-spin" />
                </div>
            ) : filteredAvisos.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gunmetal-600">Nenhum aviso encontrado</h3>
                    <p className="text-gray-500">Crie o primeiro comunicado para o mural.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[30%]">Título / Tipo</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[40%]">Descrição</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-[20%]">Data</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-[10%]">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAvisos.map((aviso) => (
                                <tr key={aviso.id} className="hover:bg-gray-50 transition-colors group">
                                    
                                    {/* Coluna Título e Badge */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex flex-col gap-2">
                                            <span className="font-medium text-gunmetal-600 text-base">
                                                {aviso.titulo}
                                            </span>
                                            
                                            {/* Badge de Prioridade */}
                                            {aviso.tipo === 'URGENTE' ? (
                                                <span className="inline-flex items-center w-fit gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 border border-red-200 uppercase tracking-wide">
                                                    <AlertCircle className="w-3 h-3" /> Urgente
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center w-fit gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wide">
                                                    <Info className="w-3 h-3" /> Geral
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Coluna Descrição */}
                                    <td className="px-6 py-4 text-gray-500 align-top">
                                        <p className="line-clamp-2 text-sm leading-relaxed whitespace-pre-wrap">
                                            {aviso.descricao}
                                        </p>
                                    </td>

                                    {/* Coluna Data (Evento ou Criação) */}
                                    <td className="px-6 py-4 text-right align-top">
                                        <div className="flex flex-col items-end gap-1">
                                            {aviso.dataEvento ? (
                                                <>
                                                    <div className="flex items-center gap-1 text-blue-600 font-medium text-sm">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(aviso.dataEvento).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'})}
                                                    </div>
                                                    <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">
                                                        Data do Evento
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="text-gray-600 text-sm">
                                                        {new Date(aviso.criadoEm || aviso.criadoEm).toLocaleDateString('pt-BR')}
                                                    </div>
                                                    <span className="text-[10px] text-gray-400">
                                                        Publicado às {new Date(aviso.criadoEm || aviso.criadoEm).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </td>

                                    {/* Coluna Ações */}
                                    <td className="px-6 py-4 text-right align-top">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* Botão Editar */}
                                            <button
                                                onClick={() => handleOpenEdit(aviso)}
                                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>

                                            {/* Botão Excluir */}
                                            <button
                                                onClick={() => handleInitialDelete(aviso.id)}
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

            {/* --- MODAL DE FORMULÁRIO (Criação/Edição) --- */}
            <AvisoFormDialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleFormSuccess}
                avisoToEdit={editingAviso}
            />

            {/* --- MODAL DE CONFIRMAÇÃO (Exclusão) --- */}
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