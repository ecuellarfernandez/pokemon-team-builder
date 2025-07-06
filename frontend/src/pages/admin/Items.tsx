import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_CONFIG, getAuthHeadersForFormData } from '../../config/api';

interface Item {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  created_at: string;
}

interface CreateItemData {
  name: string;
  description: string;
  image?: File | null;
}

const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<CreateItemData>({
    name: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/item`, {
        headers: getAuthHeadersForFormData()
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar items');
      }
      
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Error al cargar items');
    } finally {
      setLoading(false);
    }
  };

  const createItem = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/item`, {
        method: 'POST',
        headers: getAuthHeadersForFormData(),
        body: formDataToSend
      });
      
      if (!response.ok) {
        throw new Error('Error al crear item');
      }
      
      toast.success('Item creado exitosamente');
      setShowCreateModal(false);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('Error creating item:', error);
      toast.error('Error al crear item');
    }
  };

  const updateItem = async () => {
    if (!selectedItem) return;
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/item/${selectedItem.id}`, {
        method: 'PATCH',
        headers: getAuthHeadersForFormData(),
        body: formDataToSend
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar item');
      }
      
      toast.success('Item actualizado exitosamente');
      setShowEditModal(false);
      setSelectedItem(null);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Error al actualizar item');
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este item?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/item/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeadersForFormData()
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar item');
      }
      
      toast.success('Item eliminado exitosamente');
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Error al eliminar item');
    }
  };

  const openEditModal = (item: Item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      image: null
    });
    setImagePreview(item.image_url || null);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', image: null });
    setImagePreview(null);
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

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchItems();
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Items</h1>
        <p className="text-gray-600">Administra los items del sistema</p>
      </div>

      {/* Search and Create */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar items..."
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
          Crear Item
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {item.image_url ? (
                <img
                src={`${API_CONFIG.BASE_URL}${item.image_url}`}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package className="h-16 w-16 text-gray-400" />
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No se encontraron items</p>
        </div>
      )}

      {/* Create Item Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa el nombre del item"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa la descripción del item"
                />
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
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={`${API_CONFIG.BASE_URL}${imagePreview}`}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-md border"
                    />
                  </div>
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
                onClick={createItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Crear Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Editar Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={`${API_CONFIG.BASE_URL}${imagePreview}`}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={updateItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Actualizar Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;