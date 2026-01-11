import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types/auth';
import { AuthService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, Plus, Edit3, Trash2, Shield, ShieldCheck, 
  Mail, Phone, Calendar, Search, Filter, MoreVertical,
  UserPlus, UserMinus, Eye, EyeOff, X, Check, AlertCircle
} from 'lucide-react';

const UserManagement: React.FC = () => {
  const { user: currentUser, hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersList = await AuthService.getAllUsers();
      setUsers(usersList);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Gérer la sélection multiple
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  // Actions sur les utilisateurs
  const handleDeactivateUser = async (userId: string) => {
    if (!confirm('Désactiver cet utilisateur ?')) return;
    
    try {
      await AuthService.deactivateUser(userId);
      await loadUsers();
    } catch (error) {
      alert('Erreur lors de la désactivation');
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await AuthService.activateUser(userId);
      await loadUsers();
    } catch (error) {
      alert('Erreur lors de l\'activation');
    }
  };

  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    if (!confirm(`Changer le rôle de cet utilisateur vers ${newRole} ?`)) return;
    
    try {
      await AuthService.changeUserRole(userId, newRole);
      await loadUsers();
    } catch (error) {
      alert('Erreur lors du changement de rôle');
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;
    
    if (!confirm(`Appliquer l'action "${action}" à ${selectedUsers.length} utilisateur(s) ?`)) return;

    try {
      for (const userId of selectedUsers) {
        switch (action) {
          case 'activate':
            await AuthService.activateUser(userId);
            break;
          case 'deactivate':
            await AuthService.deactivateUser(userId);
            break;
        }
      }
      await loadUsers();
      setSelectedUsers([]);
    } catch (error) {
      alert('Erreur lors de l\'action groupée');
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return <ShieldCheck className="text-red-600" size={16} />;
      case UserRole.ADMIN:
        return <Shield className="text-orange-600" size={16} />;
      case UserRole.EDITOR:
        return <Edit3 className="text-blue-600" size={16} />;
      case UserRole.VIEWER:
        return <Eye className="text-gray-600" size={16} />;
      default:
        return <Users className="text-gray-400" size={16} />;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'Super Admin';
      case UserRole.ADMIN:
        return 'Administrateur';
      case UserRole.EDITOR:
        return 'Éditeur';
      case UserRole.VIEWER:
        return 'Lecteur';
      default:
        return role;
    }
  };

  const canManageUser = (targetUser: User) => {
    if (!currentUser) return false;
    
    // Super admin peut tout faire
    if (currentUser.role === UserRole.SUPER_ADMIN) return true;
    
    // Admin peut gérer les éditeurs et lecteurs
    if (currentUser.role === UserRole.ADMIN) {
      return targetUser.role === UserRole.EDITOR || targetUser.role === UserRole.VIEWER;
    }
    
    return false;
  };

  if (!hasPermission('users', 'read')) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Accès refusé</h3>
        <p className="text-slate-600">Vous n'avez pas les permissions pour gérer les utilisateurs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestion des Utilisateurs</h2>
          <p className="text-slate-600">{users.length} utilisateur(s) au total</p>
        </div>
        
        {hasPermission('users', 'create') && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <UserPlus size={20} />
            Nouvel Utilisateur
          </button>
        )}
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Filtre par rôle */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">Tous les rôles</option>
            <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
            <option value={UserRole.ADMIN}>Administrateur</option>
            <option value={UserRole.EDITOR}>Éditeur</option>
            <option value={UserRole.VIEWER}>Lecteur</option>
          </select>

          {/* Filtre par statut */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>

        {/* Actions groupées */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-800">
              {selectedUsers.length} utilisateur(s) sélectionné(s)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Activer
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Désactiver
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="px-3 py-1 bg-slate-600 text-white text-sm rounded hover:bg-slate-700"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Dernière connexion
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-slate-600 font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span className="text-sm font-medium text-slate-700">
                          {getRoleLabel(user.role)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString('fr-FR')
                        : 'Jamais'
                      }
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {canManageUser(user) && (
                          <>
                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded"
                              title="Éditer"
                            >
                              <Edit3 size={16} />
                            </button>
                            
                            {user.isActive ? (
                              <button
                                onClick={() => handleDeactivateUser(user.id)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded"
                                title="Désactiver"
                              >
                                <UserMinus size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivateUser(user.id)}
                                className="p-1 text-slate-400 hover:text-green-600 rounded"
                                title="Activer"
                              >
                                <UserPlus size={16} />
                              </button>
                            )}
                          </>
                        )}
                        
                        <UserActionsDropdown
                          user={user}
                          canManage={canManageUser(user)}
                          onChangeRole={handleChangeRole}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadUsers();
          }}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null);
            loadUsers();
          }}
        />
      )}
    </div>
  );
};

// Composant pour le menu déroulant d'actions
const UserActionsDropdown: React.FC<{
  user: User;
  canManage: boolean;
  onChangeRole: (userId: string, role: UserRole) => void;
}> = ({ user, canManage, onChangeRole }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!canManage) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-slate-400 hover:text-slate-600 rounded"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-20">
            <div className="py-1">
              <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-100">
                Changer le rôle
              </div>
              {Object.values(UserRole).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    onChangeRole(user.id, role);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${
                    user.role === role ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                  }`}
                  disabled={user.role === role}
                >
                  {role === UserRole.SUPER_ADMIN && 'Super Admin'}
                  {role === UserRole.ADMIN && 'Administrateur'}
                  {role === UserRole.EDITOR && 'Éditeur'}
                  {role === UserRole.VIEWER && 'Lecteur'}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Modal d'ajout d'utilisateur
const AddUserModal: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.EDITOR
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AuthService.register(formData);
      onSuccess();
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Nouvel Utilisateur</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Rôle
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={UserRole.VIEWER}>Lecteur</option>
              <option value={UserRole.EDITOR}>Éditeur</option>
              <option value={UserRole.ADMIN}>Administrateur</option>
              <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal d'édition d'utilisateur
const EditUserModal: React.FC<{
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AuthService.updateUserProfile(user.id, formData);
      onSuccess();
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Éditer l'Utilisateur</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Rôle
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={UserRole.VIEWER}>Lecteur</option>
              <option value={UserRole.EDITOR}>Éditeur</option>
              <option value={UserRole.ADMIN}>Administrateur</option>
              <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;