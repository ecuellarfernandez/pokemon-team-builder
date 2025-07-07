import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Zap as PokemonIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_CONFIG, getAuthHeaders, getAuthHeadersForFormData } from '../../config/api';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

interface Pokemon {
  id: string;
  name: string;
  type_1_id: string;
  type_2_id?: string;
  base_hp: number;
  base_atk: number;
  base_def: number;
  base_spa: number;
  base_spd: number;
  base_spe: number;
  image_url?: string;
  type1?: {
    id: string;
    name: string;
  };
  type2?: {
    id: string;
    name: string;
  };
  created_at: string;
}

interface Type {
  id: string;
  name: string;
}

interface CreatePokemonData {
  name: string;
  type_1_id: string;
  type_2_id?: string;
  base_hp: number;
  base_atk: number;
  base_def: number;
  base_spa: number;
  base_spd: number;
  base_spe: number;
  image?: File | null;
}

const PokemonAdmin: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [formData, setFormData] = useState<CreatePokemonData>({
    name: '',
    type_1_id: '',
    type_2_id: '',
    base_hp: 1,
    base_atk: 1,
    base_def: 1,
    base_spa: 1,
    base_spd: 1,
    base_spe: 1,
    image: null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pokemonToDelete, setPokemonToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/pokemon`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar pokemon');
      }
      
      const data = await response.json();
      setPokemon(data);
    } catch (error) {
      console.error('Error fetching pokemon:', error);
      toast.error('Error al cargar pokemon');
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

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.type_1_id) {
      newErrors.type_1_id = 'El tipo primario es requerido';
    }
    
    if (formData.type_2_id && formData.type_1_id === formData.type_2_id) {
      newErrors.type_2_id = 'El tipo secundario debe ser diferente al primario';
    }
    
    const stats = ['base_hp', 'base_atk', 'base_def', 'base_spa', 'base_spd', 'base_spe'];
    stats.forEach(stat => {
      const value = formData[stat as keyof CreatePokemonData];
      if (typeof value === 'number' && value < 1) {
        newErrors[stat] = 'Las estadísticas deben ser mayor a 0';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createPokemon = async () => {
    if (!validateForm()) return;
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('type_1_id', formData.type_1_id);
      if (formData.type_2_id) {
        formDataToSend.append('type_2_id', formData.type_2_id);
      }
      formDataToSend.append('base_hp', formData.base_hp.toString());
      formDataToSend.append('base_atk', formData.base_atk.toString());
      formDataToSend.append('base_def', formData.base_def.toString());
      formDataToSend.append('base_spa', formData.base_spa.toString());
      formDataToSend.append('base_spd', formData.base_spd.toString());
      formDataToSend.append('base_spe', formData.base_spe.toString());
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/pokemon`, {
        method: 'POST',
        headers: getAuthHeadersForFormData(),
        body: formDataToSend
      });
      
      if (!response.ok) {
        throw new Error('Error al crear pokemon');
      }
      
      toast.success('Pokemon creado exitosamente');
      setShowCreateModal(false);
      resetForm();
      fetchPokemon();
    } catch (error) {
      console.error('Error creating pokemon:', error);
      toast.error('Error al crear pokemon');
    }
  };

  const updatePokemon = async () => {
    if (!selectedPokemon || !validateForm()) return;
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('type_1_id', formData.type_1_id);
      if (formData.type_2_id) {
        formDataToSend.append('type_2_id', formData.type_2_id);
      }
      formDataToSend.append('base_hp', formData.base_hp.toString());
      formDataToSend.append('base_atk', formData.base_atk.toString());
      formDataToSend.append('base_def', formData.base_def.toString());
      formDataToSend.append('base_spa', formData.base_spa.toString());
      formDataToSend.append('base_spd', formData.base_spd.toString());
      formDataToSend.append('base_spe', formData.base_spe.toString());
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/pokemon/${selectedPokemon.id}`, {
        method: 'PATCH',
        headers: getAuthHeadersForFormData(),
        body: formDataToSend
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar pokemon');
      }
      
      toast.success('Pokemon actualizado exitosamente');
      setShowEditModal(false);
      setSelectedPokemon(null);
      resetForm();
      fetchPokemon();
    } catch (error) {
      console.error('Error updating pokemon:', error);
      toast.error('Error al actualizar pokemon');
    }
  };

  const openDeleteConfirm = (pokemonId: string) => {
    setPokemonToDelete(pokemonId);
    setShowDeleteConfirm(true);
  };

  const deletePokemon = async () => {
    if (!pokemonToDelete) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/pokemon/${pokemonToDelete}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar pokemon');
      }
      
      toast.success('Pokemon eliminado exitosamente');
      fetchPokemon();
      setShowDeleteConfirm(false);
      setPokemonToDelete(null);
    } catch (error) {
      console.error('Error deleting pokemon:', error);
      toast.error('Error al eliminar pokemon');
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = async (poke: Pokemon) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pokemon/${poke.id}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar datos del pokemon');
      }
      
      const pokemonData = await response.json();
      
      setSelectedPokemon(pokemonData);
      setFormData({
        name: pokemonData.name,
        type_1_id: pokemonData.type_1_id,
        type_2_id: pokemonData.type_2_id || '',
        base_hp: pokemonData.base_hp,
        base_atk: pokemonData.base_atk,
        base_def: pokemonData.base_def,
        base_spa: pokemonData.base_spa,
        base_spd: pokemonData.base_spd,
        base_spe: pokemonData.base_spe,
        image: null
      });
      setImagePreview(pokemonData.image_url ? `${API_CONFIG.BASE_URL}${pokemonData.image_url}` : null);
      setShowEditModal(true);
    } catch (error) {
      console.error('Error loading pokemon data:', error);
      toast.error('Error al cargar datos del pokemon');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type_1_id: '',
      type_2_id: '',
      base_hp: 1,
      base_atk: 1,
      base_def: 1,
      base_spa: 1,
      base_spd: 1,
      base_spe: 1,
      image: null
    });
    setImagePreview(null);
    setErrors({});
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredPokemon = pokemon.filter(poke =>
    poke.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchPokemon();
    fetchTypes();
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Pokemon</h1>
        <p className="text-gray-600">Administra los pokemon del sistema</p>
      </div>

      {/* Search and Create */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar pokemon..."
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
          Crear Pokemon
        </button>
      </div>

      {/* Pokemon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPokemon.map((poke) => (
          <div key={poke.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {poke.image_url ? (
                <img
                  src={`${API_CONFIG.BASE_URL}${poke.image_url}`}
                  alt={poke.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <PokemonIcon className="h-16 w-16 text-gray-400" />
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{poke.name}</h3>
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {poke.type1?.name || 'Tipo 1'}
                </span>
                {poke.type2 && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {poke.type2.name}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-600 mb-3">
                <div className="grid grid-cols-3 gap-1">
                  <div>HP: {poke.base_hp}</div>
                  <div>ATK: {poke.base_atk}</div>
                  <div>DEF: {poke.base_def}</div>
                  <div>SPA: {poke.base_spa}</div>
                  <div>SPD: {poke.base_spd}</div>
                  <div>SPE: {poke.base_spe}</div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => openEditModal(poke)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openDeleteConfirm(poke.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredPokemon.length === 0 && (
        <div className="text-center py-12">
          <PokemonIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No se encontraron pokemon</p>
        </div>
      )}

      {/* Create Pokemon Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Crear Nuevo Pokemon"
        size="xl"
      >
        <div className="space-y-6">
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
                placeholder="Ingresa el nombre del pokemon"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo Primario *
              </label>
              <select
                value={formData.type_1_id}
                onChange={(e) => setFormData({ ...formData, type_1_id: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.type_1_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona el tipo primario</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.type_1_id && (
                <p className="mt-1 text-sm text-red-600">{errors.type_1_id}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo Secundario (opcional)
              </label>
              <select
                value={formData.type_2_id}
                onChange={(e) => setFormData({ ...formData, type_2_id: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.type_2_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona el tipo secundario</option>
                {types.filter(type => type.id !== formData.type_1_id).map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.type_2_id && (
                <p className="mt-1 text-sm text-red-600">{errors.type_2_id}</p>
              )}
            </div>
          </div>
          
          {imagePreview && (
            <div className="flex justify-center">
              <img
                src={imagePreview.startsWith('data:') ? imagePreview : `${API_CONFIG.BASE_URL}${imagePreview}`}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-md border"
              />
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Estadísticas Base</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HP
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.base_hp}
                  onChange={(e) => setFormData({ ...formData, base_hp: parseInt(e.target.value) || 1 })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.base_hp ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.base_hp && (
                  <p className="mt-1 text-sm text-red-600">{errors.base_hp}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ATK
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.base_atk}
                  onChange={(e) => setFormData({ ...formData, base_atk: parseInt(e.target.value) || 1 })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.base_atk ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.base_atk && (
                  <p className="mt-1 text-sm text-red-600">{errors.base_atk}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DEF
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.base_def}
                  onChange={(e) => setFormData({ ...formData, base_def: parseInt(e.target.value) || 1 })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.base_def ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.base_def && (
                  <p className="mt-1 text-sm text-red-600">{errors.base_def}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SPA
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.base_spa}
                  onChange={(e) => setFormData({ ...formData, base_spa: parseInt(e.target.value) || 1 })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.base_spa ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.base_spa && (
                  <p className="mt-1 text-sm text-red-600">{errors.base_spa}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SPD
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.base_spd}
                  onChange={(e) => setFormData({ ...formData, base_spd: parseInt(e.target.value) || 1 })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.base_spd ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.base_spd && (
                  <p className="mt-1 text-sm text-red-600">{errors.base_spd}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SPE
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.base_spe}
                  onChange={(e) => setFormData({ ...formData, base_spe: parseInt(e.target.value) || 1 })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.base_spe ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.base_spe && (
                  <p className="mt-1 text-sm text-red-600">{errors.base_spe}</p>
                )}
              </div>
            </div>
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
            onClick={createPokemon}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Crear Pokemon
          </button>
        </div>
      </Modal>

      {/* Edit Pokemon Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPokemon(null);
          resetForm();
        }}
        title="Editar Pokemon"
        size="xl"
      >
        <div className="space-y-6">
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
                Imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo Primario *
              </label>
              <select
                value={formData.type_1_id}
                onChange={(e) => setFormData({ ...formData, type_1_id: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.type_1_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona el tipo primario</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.type_1_id && (
                <p className="mt-1 text-sm text-red-600">{errors.type_1_id}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo Secundario (opcional)
              </label>
              <select
                value={formData.type_2_id}
                onChange={(e) => setFormData({ ...formData, type_2_id: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.type_2_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona el tipo secundario</option>
                {types.filter(type => type.id !== formData.type_1_id).map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.type_2_id && (
                <p className="mt-1 text-sm text-red-600">{errors.type_2_id}</p>
              )}
            </div>
          </div>
          
          {imagePreview && (
            <div className="flex justify-center">
              <img
                src={imagePreview.startsWith('data:') ? imagePreview : `${imagePreview}`}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-md border"
              />
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Estadísticas Base</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HP
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.base_hp}
                  onChange={(e) => setFormData({ ...formData, base_hp: parseInt(e.target.value) || 1 })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.base_hp ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.base_hp && (
                  <p className="mt-1 text-sm text-red-600">{errors.base_hp}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ATK
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.base_atk}
                  onChange={(e) => setFormData({ ...formData, base_atk: parseInt(e.target.value) || 1 })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.base_atk ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.base_atk && (
                  <p className="mt-1 text-sm text-red-600">{errors.base_atk}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DEF
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.base_def}
                  onChange={(e) => setFormData({ ...formData, base_def: parseInt(e.target.value) || 1 })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.base_def ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.base_def && (
                  <p className="mt-1 text-sm text-red-600">{errors.base_def}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SPA
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.base_spa}
                  onChange={(e) => setFormData({ ...formData, base_spa: parseInt(e.target.value) || 1 })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.base_spa ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.base_spa && (
                  <p className="mt-1 text-sm text-red-600">{errors.base_spa}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SPD
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.base_spd}
                  onChange={(e) => setFormData({ ...formData, base_spd: parseInt(e.target.value) || 1 })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.base_spd ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.base_spd && (
                  <p className="mt-1 text-sm text-red-600">{errors.base_spd}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SPE
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.base_spe}
                  onChange={(e) => setFormData({ ...formData, base_spe: parseInt(e.target.value) || 1 })}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.base_spe ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.base_spe && (
                  <p className="mt-1 text-sm text-red-600">{errors.base_spe}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => {
              setShowEditModal(false);
              setSelectedPokemon(null);
              resetForm();
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={updatePokemon}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Actualizar Pokemon
          </button>
        </div>
      </Modal>

      {/* Delete Pokemon Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setPokemonToDelete(null);
        }}
        onConfirm={deletePokemon}
        title="Eliminar Pokemon"
        message="¿Estás seguro de que quieres eliminar este pokemon? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={isDeleting}
      />
    </div>
  );
};

export default PokemonAdmin;