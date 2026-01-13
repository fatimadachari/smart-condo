'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Users, Trash2, Edit2, Loader2, ShieldCheck, UserCircle, Mail } from 'lucide-react';
import { usuarioService, Usuario, UserRole } from '@/services/usuario-service';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { UsuarioFormDialog } from '@/components/features/usuario-form-dialog';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const getRoleBadge = (role: UserRole) => {
    switch(role) {
        case UserRole.ADMIN:
            return 'bg-espresso-100 text-espresso-800 border-espresso-200';
        case UserRole.SINDICO:
            return 'bg-clay-100 text-clay-800 border-clay-200';
        case UserRole.PORTEIRO:
            return 'bg-stone-200 text-stone-700 border-stone-300';
        default:
            return 'bg-stone-50 text-stone-500 border-stone-200';
    }
  };

  const filteredUsers = usuarios.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-light text-espresso-900 tracking-tight">
            Gestão de <span className="font-semibold">Usuários</span>
          </h1>
          <p className="mt-2 text-stone-500 font-light">Controle de acesso e perfis do sistema.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-clay-500 transition-colors" />
                <input type="text" placeholder="Buscar usuário..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-clay-300 focus:ring-4 focus:ring-clay-100 transition-all shadow-sm" />
            </div>
            <button onClick={handleOpenNew} className="flex items-center gap-2 bg-espresso-800 hover:bg-espresso-900 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-stone-200 hover:shadow-xl hover:-translate-y-0.5 group">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-medium tracking-wide">Novo Usuário</span>
            </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 text-clay-400 animate-spin" /></div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-stone-100 shadow-sm flex flex-col items-center">
          <div className="p-4 bg-stone-50 rounded-full mb-4"><UserCircle className="w-8 h-8 text-stone-300" /></div>
          <h3 className="text-lg font-medium text-espresso-800">Nenhum usuário encontrado</h3>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="min-w-full divide-y divide-stone-50">
                {/* Header da "Tabela" (Estilizado) */}
                <div className="grid grid-cols-12 bg-stone-50/50 px-6 py-3 text-xs font-bold text-stone-400 uppercase tracking-widest">
                    <div className="col-span-5">Usuário</div>
                    <div className="col-span-2">Perfil</div>
                    <div className="col-span-3">Vínculo</div>
                    <div className="col-span-2 text-right">Ações</div>
                </div>

                {/* Linhas */}
                {filteredUsers.map((user) => (
                    <div key={user.id} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-stone-50/50 transition-colors group">
                        
                        {/* Coluna Usuário */}
                        <div className="col-span-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center text-stone-600 font-bold border border-white shadow-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-medium text-espresso-900">{user.name}</div>
                                <div className="flex items-center gap-1.5 text-xs text-stone-400 font-light mt-0.5">
                                    <Mail className="w-3 h-3" /> {user.email}
                                </div>
                            </div>
                        </div>

                        {/* Coluna Perfil */}
                        <div className="col-span-2">
                             <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleBadge(user.role)}`}>
                                {user.role}
                            </span>
                        </div>

                        {/* Coluna Vínculo */}
                        <div className="col-span-3 text-sm text-stone-500 font-light">
                            {user.condominio?.nome || <span className="text-stone-300 italic">Sem vínculo</span>}
                        </div>

                        {/* Ações */}
                        <div className="col-span-2 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleOpenEdit(user)} className="p-2 text-stone-400 hover:text-clay-600 hover:bg-white rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                             <button onClick={() => { setUsuarioToDelete(user.id); setIsDeleteOpen(true); }} className="p-2 text-stone-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
            </div>
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