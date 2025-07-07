import React, { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
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
  const [items, setItems] = useState<Item[]>([]);
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
    } else if (!selectedItem) {
      setSelectedItemData(null);
    }
  }, [selectedItem, items]);

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

  const handleItemSelect = (item: Item | null) => {
    setSelectedItemData(item);
    setShowDropdown(false);
    onItemSelect(item ? item.id : '');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Ítem
      </label>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
          disabled={loading}
        >
          <div className="flex items-center gap-3">
            {selectedItemData ? (
              <>
                {selectedItemData.image_url && (
                  <img
                    src={`${API_CONFIG.BASE_URL}${selectedItemData.image_url}`}
                    alt={selectedItemData.name}
                    className="w-6 h-6 object-contain"
                  />
                )}
                <span className="text-gray-900">{selectedItemData.name}</span>
              </>
            ) : (
              <span className="text-gray-500">Seleccionar ítem...</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedItemData && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemSelect(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </div>
        </button>
        
        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <button
              onClick={() => handleItemSelect(null)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-500 border-b border-gray-100"
            >
              Sin ítem
            </button>
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemSelect(item)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 border-b border-gray-100 last:border-b-0 ${
                  selectedItemData?.id === item.id ? 'bg-blue-50' : ''
                }`}
              >
                {item.image_url && (
                  <img
                    src={`${API_CONFIG.BASE_URL}${item.image_url}`}
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
                src={`${API_CONFIG.BASE_URL}${selectedItemData.image_url}`}
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