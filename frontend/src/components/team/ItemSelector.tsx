import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAuthHeaders } from '../../config/api';
import { API_CONFIG } from '../../config/api';

interface Item {
  id: string;
  name: string;
  image_url?: string;
  description?: string;
}

interface ItemSelectorProps {
  selectedItem: string;
  onItemSelect: (itemId: string) => void;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({
  selectedItem,
  onItemSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItemData, setSelectedItemData] = useState<Item | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (selectedItem && items.length > 0) {
      const item = items.find(i => i.id === selectedItem);
      setSelectedItemData(item || null);
      if (item) {
        setSearchTerm(item.name);
      }
    } else if (!selectedItem) {
      setSelectedItemData(null);
      setSearchTerm('');
    }
  }, [selectedItem, items]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  }, [searchTerm, items]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/item`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        toast.error('Error al cargar los ítems');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Error al cargar los ítems');
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelect = (item: Item) => {
    setSearchTerm(item.name);
    setSelectedItemData(item);
    setShowDropdown(false);
    onItemSelect(item.id);
  };

  const handleClearSelection = () => {
    setSearchTerm('');
    setSelectedItemData(null);
    setShowDropdown(false);
    onItemSelect('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    
    if (!value) {
      setSelectedItemData(null);
      onItemSelect('');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Ítem
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setShowDropdown(searchTerm.length > 0)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Buscar ítem..."
          disabled={loading}
        />
        
        {selectedItemData && (
          <button
            onClick={handleClearSelection}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        {showDropdown && filteredItems.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredItems.slice(0, 10).map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemSelect(item)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-6 h-6 object-contain"
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  {item.description && (
                    <div className="text-sm text-gray-600 truncate">{item.description}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ítem seleccionado */}
      {selectedItemData && (
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-3">
            {selectedItemData.image_url && (
              <img
                src={selectedItemData.image_url}
                alt={selectedItemData.name}
                className="w-8 h-8 object-contain"
              />
            )}
            <div className="flex-1">
              <div className="font-medium text-gray-900">{selectedItemData.name}</div>
              {selectedItemData.description && (
                <div className="text-sm text-gray-600">{selectedItemData.description}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemSelector;