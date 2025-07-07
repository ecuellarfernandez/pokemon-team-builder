/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_CONFIG, getAuthHeaders } from '../../config/api';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

interface Nature {
  id: string;
  name: string;
  stat_aumentada?: string;
  stat_disminuida?: string;
}

const Natures: React.FC = () => {
  const [natures, setNatures] = useState<Nature[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create/Edit Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNature, setEditingNature] = useState<Nature | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    stat_aumentada: '',
    stat_disminuida: ''
  });
  
  // Delete Confirmation States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [natureToDelete, setNatureToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchNatures();
  }, []);

  const fetchNatures = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/naturaleza`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar naturalezas');
      }
      
      const data = await response.json();
      setNatures(data);
    } catch (error) {
      console.error('Error fetching natures:', error);
      toast.error('Error al cargar naturalezas');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchNatures();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/naturaleza?name=${encodeURIComponent(searchTerm)}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      
      const data = await response.json();
      setNatures(data);
    } catch (error) {
      console.error('Error searching natures:', error);
      toast.error('Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', stat_aumentada: '', stat_disminuida: '' });
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (nature: Nature) => {
    setFormData({ 
      name: nature.name,
      stat_aumentada: nature.stat_aumentada || '',
      stat_disminuida: nature.stat_disminuida || ''
    });
    setEditingNature(nature);
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingNature(null);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }
    
   
    
    // Si solo se selecciona una estadística, limpiar la otra para naturalezas neutrales
    const finalFormData = {
      ...formData,
      stat_aumentada: formData.stat_aumentada || null,
      stat_disminuida: formData.stat_disminuida || null
    };

    try {
      setIsSubmitting(true);
      const url = editingNature 
        ? `${API_CONFIG.BASE_URL}/naturaleza/${editingNature.id}`
        : `${API_CONFIG.BASE_URL}/naturaleza`;
      
      const method = editingNature ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(finalFormData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar naturaleza');
      }

      toast.success(editingNature ? 'Naturaleza actualizada exitosamente' : 'Naturaleza creada exitosamente');
      closeModals();
      fetchNatures();
    } catch (error: any) {
      console.error('Error saving nature:', error);
      toast.error(error.message || 'Error al guardar naturaleza');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteConfirm = (natureId: string) => {
    setNatureToDelete(natureId);
    setShowDeleteConfirm(true);
  };

  const deleteNature = async () => {
    if (!natureToDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/naturaleza/${natureToDelete}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar naturaleza');
      }

      toast.success('Naturaleza eliminada exitosamente');
      fetchNatures();
    } catch (error: any) {
      console.error('Error deleting nature:', error);
      toast.error(error.message || 'Error al eliminar naturaleza');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setNatureToDelete(null);
    }
  };

  const filteredNatures = natures.filter(nature =>
    nature.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && natures.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Naturalezas</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Crear Naturaleza
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar naturalezas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
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
            fetchNatures();
          }}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Limpiar
        </button>
      </div>

      {/* Natures Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stat Aumentada
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stat Disminuida
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
            {filteredNatures.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center">
                    <Heart className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No se encontraron naturalezas</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredNatures.map((nature) => (
                <tr key={nature.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                          <Heart className="h-6 w-6 text-pink-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{nature.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {nature.stat_aumentada ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          +{nature.stat_aumentada.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-gray-400">Ninguna</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {nature.stat_disminuida ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          -{nature.stat_disminuida.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-gray-400">Ninguna</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{nature.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(nature)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar naturaleza"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(nature.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar naturaleza"
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

      {/* Create Nature Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeModals}
        title="Crear Nueva Naturaleza"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Naturaleza
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Adamant, Modest, Jolly..."
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stat_aumentada" className="block text-sm font-medium text-gray-700 mb-1">
                Estadística Aumentada (+10%)
              </label>
              <select
                id="stat_aumentada"
                value={formData.stat_aumentada}
                onChange={(e) => setFormData({ ...formData, stat_aumentada: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Ninguna (Neutral)</option>
                <option value="atk">Ataque</option>
                <option value="def">Defensa</option>
                <option value="spa">Ataque Especial</option>
                <option value="spd">Defensa Especial</option>
                <option value="spe">Velocidad</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="stat_disminuida" className="block text-sm font-medium text-gray-700 mb-1">
                Estadística Disminuida (-10%)
              </label>
              <select
                id="stat_disminuida"
                value={formData.stat_disminuida}
                onChange={(e) => setFormData({ ...formData, stat_disminuida: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Ninguna (Neutral)</option>
                <option value="atk">Ataque</option>
                <option value="def">Defensa</option>
                <option value="spa">Ataque Especial</option>
                <option value="spd">Defensa Especial</option>
                <option value="spe">Velocidad</option>
              </select>
            </div>
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
              {isSubmitting ? 'Creando...' : 'Crear Naturaleza'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Nature Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={closeModals}
        title="Editar Naturaleza"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Naturaleza
            </label>
            <input
              type="text"
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Adamant, Modest, Jolly..."
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-stat_aumentada" className="block text-sm font-medium text-gray-700 mb-1">
                Estadística Aumentada (+10%)
              </label>
              <select
                id="edit-stat_aumentada"
                value={formData.stat_aumentada}
                onChange={(e) => setFormData({ ...formData, stat_aumentada: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Ninguna (Neutral)</option>
                <option value="atk">Ataque</option>
                <option value="def">Defensa</option>
                <option value="spa">Ataque Especial</option>
                <option value="spd">Defensa Especial</option>
                <option value="spe">Velocidad</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="edit-stat_disminuida" className="block text-sm font-medium text-gray-700 mb-1">
                Estadística Disminuida (-10%)
              </label>
              <select
                id="edit-stat_disminuida"
                value={formData.stat_disminuida}
                onChange={(e) => setFormData({ ...formData, stat_disminuida: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Ninguna (Neutral)</option>
                <option value="atk">Ataque</option>
                <option value="def">Defensa</option>
                <option value="spa">Ataque Especial</option>
                <option value="spd">Defensa Especial</option>
                <option value="spe">Velocidad</option>
              </select>
            </div>
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
              {isSubmitting ? 'Actualizando...' : 'Actualizar Naturaleza'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setNatureToDelete(null);
        }}
        onConfirm={deleteNature}
        title="Eliminar Naturaleza"
        message="¿Estás seguro de que deseas eliminar esta naturaleza? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={isDeleting}
      />
    </div>
  );
};

export default Natures;