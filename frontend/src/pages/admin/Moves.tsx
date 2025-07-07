import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Swords } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_CONFIG, getAuthHeaders } from '../../config/api';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

interface Move {
  id: string;
  name: string;
  type_id: string;
  categoria_id: string;
  power?: number;
  accuracy: number;
  description: string;
  type?: {
    id: string;
    name: string;
  };
  categoria?: {
    id: string;
    name: string;
  };
  category?:{
    id: string;
    name:string;
  }
  created_at: string;
}

interface Type {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface CreateMoveData {
  name: string;
  type_id: string;
  categoria_id: string;
  power?: number;
  accuracy: number;
  description: string;
}

const Moves: React.FC = () => {
  const [moves, setMoves] = useState<Move[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [formData, setFormData] = useState<CreateMoveData>({
    name: '',
    type_id: '',
    categoria_id: '',
    power: undefined,
    accuracy: 100,
    description: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [moveToDelete, setMoveToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fetchMoves = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/movimiento`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar movimientos');
      }
      
      const data = await response.json();
      setMoves(data);
    } catch (error) {
      console.error('Error fetching moves:', error);
      toast.error('Error al cargar movimientos');
    } finally {
      setLoading(false);
    }
  };

  const fetchTypes = async () => {
    try {
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
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/categoria-movimiento`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar categorías');
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error al cargar categorías');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.type_id) {
      newErrors.type_id = 'El tipo es requerido';
    }
    
    if (!formData.categoria_id) {
      newErrors.categoria_id = 'La categoría es requerida';
    }
    
    if (formData.power !== undefined && (formData.power < 1)) {
      newErrors.power = 'El poder debe ser mayor a 0';
    }
    
    if (formData.accuracy < 1 || formData.accuracy > 100) {
      newErrors.accuracy = 'La precisión debe estar entre 1 y 100';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMove = async () => {
    if (!validateForm()) return;
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/movimiento`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Error al crear movimiento');
      }
      
      toast.success('Movimiento creado exitosamente');
      setShowCreateModal(false);
      resetForm();
      fetchMoves();
    } catch (error) {
      console.error('Error creating move:', error);
      toast.error('Error al crear movimiento');
    }
  };

  const updateMove = async () => {
    if (!selectedMove || !validateForm()) return;
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/movimiento/${selectedMove.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar movimiento');
      }
      
      toast.success('Movimiento actualizado exitosamente');
      setShowEditModal(false);
      setSelectedMove(null);
      resetForm();
      fetchMoves();
    } catch (error) {
      console.error('Error updating move:', error);
      toast.error('Error al actualizar movimiento');
    }
  };

  const openDeleteConfirm = (moveId: string) => {
    setMoveToDelete(moveId);
    setShowDeleteConfirm(true);
  };

  const deleteMove = async () => {
    if (!moveToDelete) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/movimiento/${moveToDelete}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar movimiento');
      }
      
      toast.success('Movimiento eliminado exitosamente');
      fetchMoves();
      setShowDeleteConfirm(false);
      setMoveToDelete(null);
    } catch (error) {
      console.error('Error deleting move:', error);
      toast.error('Error al eliminar movimiento');
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = async (move: Move) => {
    try {
      // Fetch fresh data from backend to ensure we have complete move data
      const response = await fetch(`${API_CONFIG.BASE_URL}/movimiento/${move.id}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar datos del movimiento');
      }
      
      const freshMoveData = await response.json();
      
      setSelectedMove(freshMoveData);
      setFormData({
        name: freshMoveData.name,
        type_id: freshMoveData.type_id,
        categoria_id: freshMoveData.categoria_id,
        power: freshMoveData.power,
        accuracy: freshMoveData.accuracy,
        description: freshMoveData.description
      });
      setShowEditModal(true);
    } catch (error) {
      console.error('Error fetching move data:', error);
      toast.error('Error al cargar datos del movimiento');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type_id: '',
      categoria_id: '',
      power: undefined,
      accuracy: 100,
      description: ''
    });
    setErrors({});
  };

  const filteredMoves = moves.filter(move =>
    move.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    move.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchMoves();
    fetchTypes();
    fetchCategories();
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Movimientos</h1>
        <p className="text-gray-600">Administra los movimientos del sistema</p>
      </div>

      {/* Search and Create */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar movimientos..."
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
          Crear Movimiento
        </button>
      </div>

      {/* Moves Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Movimiento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Poder
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precisión
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMoves.map((move) => (
              <tr key={move.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Swords className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{move.name}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate overflow-hidden whitespace-nowrap">
  {move.description}
</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {move.type?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {move.category?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {move.power || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {move.accuracy}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(move)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(move.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredMoves.length === 0 && (
          <div className="text-center py-12">
            <Swords className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No se encontraron movimientos</p>
          </div>
        )}
      </div>

      {/* Create Move Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Crear Nuevo Movimiento"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Ingresa el nombre del movimiento"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={formData.type_id}
                onChange={(e) => setFormData({ ...formData, type_id: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.type_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona un tipo</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.type_id && (
                <p className="mt-1 text-sm text-red-600">{errors.type_id}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={formData.categoria_id}
                onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.categoria_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoria_id && (
                <p className="mt-1 text-sm text-red-600">{errors.categoria_id}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Poder (opcional)
              </label>
              <input
                type="number"
                min="1"
                value={formData.power || ''}
                onChange={(e) => setFormData({ ...formData, power: e.target.value ? parseInt(e.target.value) : undefined })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.power ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Poder del movimiento"
              />
              {errors.power && (
                <p className="mt-1 text-sm text-red-600">{errors.power}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precisión (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.accuracy}
                onChange={(e) => setFormData({ ...formData, accuracy: parseInt(e.target.value) || 100 })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.accuracy ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.accuracy && (
                <p className="mt-1 text-sm text-red-600">{errors.accuracy}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ingresa la descripción del movimiento"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
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
            onClick={createMove}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Crear Movimiento
          </button>
        </div>
      </Modal>

      {/* Edit Move Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMove(null);
          resetForm();
        }}
        title="Editar Movimiento"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={formData.type_id}
                onChange={(e) => setFormData({ ...formData, type_id: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.type_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona un tipo</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.type_id && (
                <p className="mt-1 text-sm text-red-600">{errors.type_id}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={formData.categoria_id}
                onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.categoria_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoria_id && (
                <p className="mt-1 text-sm text-red-600">{errors.categoria_id}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Poder (opcional)
              </label>
              <input
                type="number"
                min="1"
                value={formData.power || ''}
                onChange={(e) => setFormData({ ...formData, power: e.target.value ? parseInt(e.target.value) : undefined })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.power ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.power && (
                <p className="mt-1 text-sm text-red-600">{errors.power}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precisión (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.accuracy}
                onChange={(e) => setFormData({ ...formData, accuracy: parseInt(e.target.value) || 100 })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.accuracy ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.accuracy && (
                <p className="mt-1 text-sm text-red-600">{errors.accuracy}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => {
              setShowEditModal(false);
              setSelectedMove(null);
              resetForm();
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={updateMove}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Actualizar Movimiento
          </button>
        </div>
      </Modal>

      {/* Delete Move Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setMoveToDelete(null);
        }}
        onConfirm={deleteMove}
        title="Eliminar Movimiento"
        message="¿Estás seguro de que quieres eliminar este movimiento? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={isDeleting}
      />
    </div>
  );
};

export default Moves;