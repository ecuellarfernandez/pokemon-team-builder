import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_CONFIG, getAuthHeaders } from '../../config/api';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

interface Ability {
  id: string;
  name: string;
  created_at: string;
}

interface CreateAbilityData {
  name: string;
}

const Abilities: React.FC = () => {
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
  const [formData, setFormData] = useState<CreateAbilityData>({
    name: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [abilityToDelete, setAbilityToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fetchAbilities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/habilidad`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar habilidades');
      }
      
      const data = await response.json();
      setAbilities(data);
    } catch (error) {
      console.error('Error fetching abilities:', error);
      toast.error('Error al cargar habilidades');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length > 100) {
      newErrors.name = 'El nombre no puede exceder 100 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createAbility = async () => {
    if (!validateForm()) return;
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/habilidad`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Error al crear habilidad');
      }
      
      toast.success('Habilidad creada exitosamente');
      setShowCreateModal(false);
      resetForm();
      fetchAbilities();
    } catch (error) {
      console.error('Error creating ability:', error);
      toast.error('Error al crear habilidad');
    }
  };

  const updateAbility = async () => {
    if (!selectedAbility || !validateForm()) return;
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/habilidad/${selectedAbility.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar habilidad');
      }
      
      toast.success('Habilidad actualizada exitosamente');
      setShowEditModal(false);
      setSelectedAbility(null);
      resetForm();
      fetchAbilities();
    } catch (error) {
      console.error('Error updating ability:', error);
      toast.error('Error al actualizar habilidad');
    }
  };

  const openDeleteConfirm = (abilityId: string) => {
    setAbilityToDelete(abilityId);
    setShowDeleteConfirm(true);
  };

  const deleteAbility = async () => {
    if (!abilityToDelete) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/habilidad/${abilityToDelete}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar habilidad');
      }
      
      toast.success('Habilidad eliminada exitosamente');
      fetchAbilities();
      setShowDeleteConfirm(false);
      setAbilityToDelete(null);
    } catch (error) {
      console.error('Error deleting ability:', error);
      toast.error('Error al eliminar habilidad');
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (ability: Ability) => {
    setSelectedAbility(ability);
    setFormData({
      name: ability.name
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '' });
    setErrors({});
  };

  const filteredAbilities = abilities.filter(ability =>
    ability.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchAbilities();
  }, []);

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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Habilidades</h1>
        <p className="text-gray-600">Administra las habilidades del sistema</p>
      </div>

      {/* Search and Create */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar habilidades..."
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
          Crear Habilidad
        </button>
      </div>

      {/* Abilities Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Habilidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Id
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAbilities.map((ability) => (
              <tr key={ability.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{ability.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(ability.id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(ability)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(ability.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAbilities.length === 0 && (
          <div className="text-center py-12">
            <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No se encontraron habilidades</p>
          </div>
        )}
      </div>

      {/* Create Ability Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Crear Nueva Habilidad"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ingresa el nombre de la habilidad"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => {
              setShowCreateModal(false);
              resetForm();
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={createAbility}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Crear Habilidad
          </button>
        </div>
      </Modal>

      {/* Edit Ability Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAbility(null);
          resetForm();
        }}
        title="Editar Habilidad"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => {
              setShowEditModal(false);
              setSelectedAbility(null);
              resetForm();
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={updateAbility}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Actualizar Habilidad
          </button>
        </div>
      </Modal>

      {/* Delete Ability Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setAbilityToDelete(null);
        }}
        onConfirm={deleteAbility}
        title="Eliminar Habilidad"
        message="¿Estás seguro de que quieres eliminar esta habilidad? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={isDeleting}
      />
    </div>
  );
};

export default Abilities;