/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Type } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_CONFIG, getAuthHeaders } from '../../config/api';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

interface Type {
  id: string;
  name: string;
}

const Types: React.FC = () => {
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create/Edit Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingType, setEditingType] = useState<Type | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    name: ''
  });
  
  // Delete Confirmation States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/tipo`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar tipos');
      }
      
      const data = await response.json();
      setTypes(data);
    } catch (error) {
      console.error('Error fetching types:', error);
      toast.error('Error al cargar tipos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchTypes();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/tipo?name=${encodeURIComponent(searchTerm)}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      
      const data = await response.json();
      setTypes(data);
    } catch (error) {
      console.error('Error searching types:', error);
      toast.error('Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '' });
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (type: Type) => {
    setFormData({ name: type.name });
    setEditingType(type);
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingType(null);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    try {
      setIsSubmitting(true);
      const url = editingType 
        ? `${API_CONFIG.BASE_URL}/tipo/${editingType.id}`
        : `${API_CONFIG.BASE_URL}/tipo`;
      
      const method = editingType ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar tipo');
      }

      toast.success(editingType ? 'Tipo actualizado exitosamente' : 'Tipo creado exitosamente');
      closeModals();
      fetchTypes();
    } catch (error: any) {
      console.error('Error saving type:', error);
      toast.error(error.message || 'Error al guardar tipo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteConfirm = (typeId: string) => {
    setTypeToDelete(typeId);
    setShowDeleteConfirm(true);
  };

  const deleteType = async () => {
    if (!typeToDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/tipo/${typeToDelete}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar tipo');
      }

      toast.success('Tipo eliminado exitosamente');
      fetchTypes();
    } catch (error: any) {
      console.error('Error deleting type:', error);
      toast.error(error.message || 'Error al eliminar tipo');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setTypeToDelete(null);
    }
  };

  const filteredTypes = types.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && types.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Tipos</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Crear Tipo
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar tipos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          <button
            onClick={() => {
              setSearchTerm('');
              fetchTypes();
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Types Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTypes.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center">
                  <Type className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No se encontraron tipos</p>
                </td>
              </tr>
            ) : (
              filteredTypes.map((type) => (
                <tr key={type.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Type className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{type.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{type.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(type)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar tipo"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(type.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar tipo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Type Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeModals}
        title="Crear Nuevo Tipo"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Tipo
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Fire, Water, Electric..."
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closeModals}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Creando...' : 'Crear Tipo'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Type Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={closeModals}
        title="Editar Tipo"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Tipo
            </label>
            <input
              type="text"
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Fire, Water, Electric..."
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closeModals}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Actualizando...' : 'Actualizar Tipo'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setTypeToDelete(null);
        }}
        onConfirm={deleteType}
        title="Eliminar Tipo"
        message="¿Estás seguro de que deseas eliminar este tipo? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={isDeleting}
      />
    </div>
  );
};

export default Types;