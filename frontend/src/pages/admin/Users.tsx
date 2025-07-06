/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, User, Shield, Key } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_CONFIG, getAuthHeaders } from '../../config/api';

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role_id: string;
  role?: Role;
  created_at: string;
}

interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role_id: string;
}

interface UpdateUserData {
  username?: string;
  email?: string;
  role_id?: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [formData, setFormData] = useState<CreateUserData>({
    username: '',
    email: '',
    password: '',
    role_id: ''
  });
  const [errors, setErrors] = useState<Partial<CreateUserData>>({});
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<{newPassword?: string; confirmPassword?: string}>({});



  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/usuario`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateUserData> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!formData.role_id) {
      newErrors.role_id = 'El rol es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createUser = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role_id: formData.role_id
      };
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/usuario`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        toast.success('Usuario creado exitosamente');
        setShowCreateModal(false);
        setFormData({ username: '', email: '', password: '', role_id: roles.length > 0 ? roles[0].id : '' });
        setErrors({});
        fetchUsers();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error al crear usuario');
    }
  };

  const validateEditForm = (): boolean => {
    const newErrors: Partial<CreateUserData> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!formData.role_id) {
      newErrors.role_id = 'El rol es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateUser = async () => {
    if (!selectedUser || !validateEditForm()) return;
    
    try {
      const updateData: any = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        role_id: formData.role_id
      };
      
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/usuario/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        toast.success('Usuario actualizado exitosamente');
        setShowEditModal(false);
        setSelectedUser(null);
        setFormData({ username: '', email: '', password: '', role_id: roles.length > 0 ? roles[0].id : '' });
        setErrors({});
        fetchUsers();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error al actualizar usuario');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/usuario/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar usuario');
      }
      
      toast.success('Usuario eliminado exitosamente');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar usuario');
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role_id: user.role_id
    });
    setErrors({});
    setShowEditModal(true);
  };

  const openChangePasswordModal = (user: User) => {
    setSelectedUser(user);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setPasswordErrors({});
    setShowChangePasswordModal(true);
  };

  const toggleAdminAccess = async (user: User) => {
    try {
      const adminRole = roles.find(role => role.name === 'admin');
      const userRole = roles.find(role => role.name === 'user');
      
      if (!adminRole || !userRole) {
        toast.error('Error: No se pudieron encontrar los roles');
        return;
      }
      
      const newRoleId = user.role?.name === 'admin' ? userRole.id : adminRole.id;
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/usuario/${user.id}`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role_id: newRoleId }),
      });
      
      if (response.ok) {
        const action = user.role?.name === 'admin' ? 'removido' : 'otorgado';
        toast.success(`Acceso de administrador ${action} exitosamente`);
        fetchUsers();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al cambiar el acceso de administrador');
      }
    } catch (error) {
      console.error('Error toggling admin access:', error);
      toast.error('Error al cambiar el acceso de administrador');
    }
  };

  const validatePasswordForm = (): boolean => {
    const newErrors: {newPassword?: string; confirmPassword?: string} = {};
    
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmar contraseña es requerido';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changePassword = async () => {
    if (!selectedUser || !validatePasswordForm()) return;
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/usuario/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: passwordData.newPassword }),
      });
      
      if (response.ok) {
        toast.success('Contraseña cambiada exitosamente');
        setShowChangePasswordModal(false);
        setSelectedUser(null);
        setPasswordData({ newPassword: '', confirmPassword: '' });
        setPasswordErrors({});
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Error al cambiar la contraseña');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/usuario/roles`, {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const rolesData = await response.json();
        setRoles(rolesData);
        // Set default role_id to first role if available
        if (rolesData.length > 0 && !formData.role_id) {
          setFormData(prev => ({ ...prev, role_id: rolesData[0].id }));
        }
      } else {
        toast.error('Error al cargar los roles');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Error al cargar los roles');
    } finally {
      setLoadingRoles(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
        <p className="text-gray-600">Administra los usuarios del sistema</p>
      </div>

      {/* Search and Create */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Crear Usuario
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role?.name === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role?.name === 'admin' ? (
                      <Shield className="h-3 w-3 mr-1" />
                    ) : (
                      <User className="h-3 w-3 mr-1" />
                    )}
                    {user.role?.name === 'admin' ? 'Administrador' : 'Usuario'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => toggleAdminAccess(user)}
                      className={`px-2 py-1 text-xs rounded ${
                        user.role?.name === 'admin'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      title={user.role?.name === 'admin' ? 'Quitar acceso admin' : 'Dar acceso admin'}
                    >
                      {user.role?.name === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                    </button>
                    <button
                       onClick={() => openChangePasswordModal(user)}
                       className="text-yellow-600 hover:text-yellow-900"
                       title="Cambiar contraseña"
                     >
                       <Key className="h-4 w-4" />
                     </button>
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Editar usuario"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar usuario"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron usuarios</p>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Usuario</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.username ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa el nombre de usuario"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa el email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa la contraseña"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  value={formData.role_id}
                  onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.role_id ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loadingRoles}
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name === 'admin' ? 'Administrador' : 'Usuario'}
                    </option>
                  ))}
                </select>
                {errors.role_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.role_id}</p>
                )}
                {loadingRoles && (
                  <p className="text-gray-500 text-xs mt-1">Cargando roles...</p>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({ username: '', email: '', password: '', role_id: roles.length > 0 ? roles[0].id : '' });
                  setErrors({});
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={createUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Crear Usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.username ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña (opcional)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Dejar vacío para mantener la actual"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  value={formData.role_id}
                  onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.role_id ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loadingRoles}
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name === 'admin' ? 'Administrador' : 'Usuario'}
                    </option>
                  ))}
                </select>
                {errors.role_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.role_id}</p>
                )}
                {loadingRoles && (
                  <p className="text-gray-500 text-xs mt-1">Cargando roles...</p>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                  setFormData({ username: '', email: '', password: '', role_id: roles.length > 0 ? roles[0].id : '' });
                  setErrors({});
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={updateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Actualizar Usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>
            <p className="text-gray-600 mb-4">Usuario: <span className="font-medium">{selectedUser.username}</span></p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    passwordErrors.newPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa la nueva contraseña"
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    passwordErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirma la nueva contraseña"
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setSelectedUser(null);
                  setPasswordData({ newPassword: '', confirmPassword: '' });
                  setPasswordErrors({});
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={changePassword}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;