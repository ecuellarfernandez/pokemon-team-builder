/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_CONFIG, getAuthHeaders } from '../../../config/api';
import DataTable from '../../../components/ui/DataTable';
import Modal from '../../../components/ui/Modal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import UsuarioForm from './UsuarioForm';

interface Usuario {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const columns = [
    { key: 'username', label: 'Usuario' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Rol',
      render: (value: string) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === 'admin'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value === 'admin' ? 'Administrador' : 'Usuario'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Fecha de Creación',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
    },
  ];

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/usuario`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }
      
      const data = await response.json();
      setUsuarios(data);
    } catch (error: any) {
      console.error('Error fetching usuarios:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleCreate = () => {
    setSelectedUsuario(null);
    setIsModalOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleDelete = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUsuario) return;

    try {
      setDeleteLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/usuario/${selectedUsuario.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar usuario');
      }
      toast.success('Usuario eliminado exitosamente');
      fetchUsuarios();
      setIsDeleteDialogOpen(false);
      setSelectedUsuario(null);
    } catch (error: any) {
      console.error('Error deleting usuario:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar usuario');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedUsuario(null);
    fetchUsuarios();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="mt-1 text-sm text-gray-600">
            Administra los usuarios del sistema
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Nuevo Usuario
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={usuarios}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUsuario(null);
        }}
        title={selectedUsuario ? 'Editar Usuario' : 'Crear Usuario'}
        size="md"
      >
        <UsuarioForm
          usuario={selectedUsuario}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedUsuario(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUsuario(null);
        }}
        onConfirm={confirmDelete}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar al usuario "${selectedUsuario?.username}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        loading={deleteLoading}
      />
    </div>
  );
};

export default UsuariosPage;