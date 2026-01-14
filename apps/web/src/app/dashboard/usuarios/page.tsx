'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, UserCircle, Trash2, Edit2, Mail, Building } from 'lucide-react';
import { usuarioService, Usuario, UserRole } from '@/services/usuario-service';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { UsuarioFormDialog } from '@/components/features/usuario-form-dialog';
import { useToast } from '@/components/ui/toast';
import { useDebounce } from '@/hooks/use-debounce';
import { TableRowSkeleton } from '@/components/ui/skeleton';

export default function UsuariosPage() {
  const { success, error: showError } = useToast();
  
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getAll();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
      showError('Erro', 'Falha ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenNew = () => {
    setEditingUsuario(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: Usuario) => {
    setEditingUsuario(user);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    loadData();
    success('Sucesso', editingUsuario ? 'Usuário atualizado.' : 'Usuário cadastrado.');
  };

  const confirmDelete = async () => {
    if (!usuarioToDelete) return;
    setIsDeleting(true);
    try {
      await usuarioService.delete(usuarioToDelete);
      setUsuarios(prev => prev.filter(u => u.id !== usuarioToDelete));
      setIsDeleteOpen(false);
      success('Excluído', 'Acesso revogado com sucesso.');
    } catch (error) {
      showError('Erro', 'Não foi possível excluir o usuário.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch(role) {
        case UserRole.ADMIN: return 'bg-espresso-100 text-espresso-800 border-espresso-200';
        case UserRole.SINDICO: return 'bg-clay-100 text-clay-800 border-clay-200';
        case UserRole.PORTEIRO: return 'bg-stone-200 text-stone-700 border-stone-300';
        default: return 'bg-stone-50 text-stone-500 border-stone-200';
    }
  };

  const filteredUsers = usuarios.filter(u => 
    u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(debouncedSearch.toLowerCase())
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
                <input 
                  type="text" 
                  placeholder="Buscar por nome, email..." 
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
                <span className="font-medium tracking-wide">Novo Usuário</span>
            </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
           {[...Array(6)].map((_, i) => <TableRowSkeleton key={i} />)}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-stone-100 shadow-sm flex flex-col items-center">
          <div className="p-4 bg-stone-50 rounded-full mb-4 border border-stone-100"><UserCircle className="w-8 h-8 text-stone-300" /></div>
          <h3 className="text-lg font-medium text-espresso-800">Nenhum usuário encontrado</h3>
          <p className="text-stone-400 mt-1">
             {debouncedSearch ? 'Tente buscar com outro termo.' : 'Cadastre o primeiro usuário.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="min-w-full divide-y divide-stone-50">
                <div className="hidden md:grid grid-cols-12 bg-stone-50/50 px-6 py-3 text-xs font-bold text-stone-400 uppercase tracking-widest">
                    <div className="col-span-5">Usuário</div>
                    <div className="col-span-2">Perfil</div>
                    <div className="col-span-3">Vínculo</div>
                    <div className="col-span-2 text-right">Ações</div>
                </div>

                {filteredUsers.map((user) => (
                    <div key={user.id} className="grid grid-cols-1 md:grid-cols-12 items-center px-6 py-4 hover:bg-stone-50/50 transition-colors group gap-4 md:gap-0 border-b border-stone-50 last:border-0">
                        
                        <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center text-stone-600 font-bold border border-white shadow-sm shrink-0">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <div className="font-medium text-espresso-900 truncate">{user.name}</div>
                                <div className="flex items-center gap-1.5 text-xs text-stone-400 font-light mt-0.5 truncate">
                                    <Mail className="w-3 h-3 shrink-0" /> {user.email}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-6 md:col-span-2 flex md:block">
                             <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleBadge(user.role)}`}>
                                {user.role}
                            </span>
                        </div>

                        <div className="col-span-6 md:col-span-3 text-sm text-stone-500 font-light flex items-center gap-2">
                            {user.condominio ? (
                               <>
                                 <Building className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                                 <span className="truncate">{user.condominio.nome}</span>
                               </>
                            ) : (
                               <span className="text-stone-300 italic">Sem vínculo</span>
                            )}
                        </div>

                        <div className="col-span-12 md:col-span-2 flex justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleOpenEdit(user)} className="p-2 text-stone-400 hover:text-clay-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-stone-100"><Edit2 className="w-4 h-4" /></button>
                             <button onClick={() => { setUsuarioToDelete(user.id); setIsDeleteOpen(true); }} className="p-2 text-stone-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-red-100"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      <UsuarioFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        usuarioToEdit={editingUsuario}
      />

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Usuário"
        description="Tem certeza? O acesso será revogado imediatamente e não poderá ser desfeito."
        confirmText="Sim, excluir"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}