'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Users, Trash2, Edit2, Loader2, ShieldCheck, UserCircle } from 'lucide-react';
import { usuarioService, Usuario, UserRole } from '@/services/usuario-service';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { UsuarioFormDialog } from '@/components/features/usuario-form-dialog';

export default function UsuariosPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);

    // Modais
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [usuarioToDelete, setUsuarioToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await usuarioService.getAll();
            setUsuarios(data);
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
        setEditingUsuario(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (user: Usuario) => {
        setEditingUsuario(user);
        setIsFormOpen(true);
    };

    const confirmDelete = async () => {
        if (!usuarioToDelete) return;
        setIsDeleting(true);
        try {
            await usuarioService.delete(usuarioToDelete);
            setUsuarios(prev => prev.filter(u => u.id !== usuarioToDelete));
            setIsDeleteOpen(false);
        } catch (error) {
            alert('Erro ao excluir usuário');
        } finally {
            setIsDeleting(false);
        }
    };

    // Helper para cor da Badge de Role
    const getRoleBadge = (role: UserRole) => {
        const styles = {
            [UserRole.ADMIN]: 'bg-purple-100 text-purple-700 border-purple-200',
            [UserRole.SINDICO]: 'bg-terracotta-100 text-terracotta-700 border-terracotta-200',
            [UserRole.PORTEIRO]: 'bg-blue-100 text-blue-700 border-blue-200',
            [UserRole.MORADOR]: 'bg-gray-100 text-gray-700 border-gray-200',
        };
        return styles[role] || styles[UserRole.MORADOR];
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gunmetal-600 flex items-center gap-2">
                        <Users className="w-8 h-8 text-terracotta-500" />
                        Gestão de Usuários
                    </h1>
                    <p className="text-gray-500">Controle de acesso para síndicos, porteiros e moradores.</p>
                </div>
                <button
                    onClick={handleOpenNew}
                    className="flex items-center gap-2 bg-terracotta-500 text-white px-5 py-2.5 rounded-lg hover:bg-terracotta-600 transition-colors shadow-glow font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Novo Usuário
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Buscar por nome ou e-mail..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500/20" />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-terracotta-500 animate-spin" /></div>
            ) : usuarios.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gunmetal-600">Nenhum usuário encontrado</h3>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Nome / Email</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Perfil</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Vínculo</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {usuarios.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gunmetal-600">{user.name}</div>
                                        <div className="text-xs text-gray-400">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {user.condominio?.nome || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenEdit(user)} className="p-2 text-gray-400 hover:text-terracotta-500 hover:bg-terracotta-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => { setUsuarioToDelete(user.id); setIsDeleteOpen(true); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <UsuarioFormDialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={loadData}
                usuarioToEdit={editingUsuario}
            />

            <ConfirmationDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                title="Excluir Usuário"
                description="Tem certeza? O acesso será revogado imediatamente."
                confirmText="Sim, excluir"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}