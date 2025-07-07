import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAuthHeaders } from '../../config/api';
import { API_CONFIG } from '../../config/api';

interface Habilidad {
  id: string;
  name: string;
  description?: string;
  is_hidden: boolean;
}

interface HabilidadSelectorProps {
  pokemonId: string;
  selectedHabilidad: string;
  onHabilidadSelect: (habilidadId: string) => void;
}

const HabilidadSelector: React.FC<HabilidadSelectorProps> = ({
  pokemonId,
  selectedHabilidad,
  onHabilidadSelect
}) => {
  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
  const [filteredHabilidades, setFilteredHabilidades] = useState<Habilidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedHabilidadData, setSelectedHabilidadData] = useState<Habilidad | null>(null);

  useEffect(() => {
    if (pokemonId) {
      fetchHabilidades();
    }
  }, [pokemonId]);

  useEffect(() => {
    if (selectedHabilidad && habilidades.length > 0) {
      const habilidad = habilidades.find(h => h.id === selectedHabilidad);
      setSelectedHabilidadData(habilidad || null);
      if (habilidad) {
        setSearchTerm(habilidad.name);
      }
    }
  }, [selectedHabilidad, habilidades]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = habilidades.filter(habilidad =>
        habilidad.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHabilidades(filtered);
    } else {
      setFilteredHabilidades(habilidades);
    }
  }, [searchTerm, habilidades]);

  const fetchHabilidades = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pokemon/${pokemonId}/habilidades`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setHabilidades(data);
      } else {
        toast.error('Error al cargar las habilidades');
      }
    } catch (error) {
      console.error('Error fetching habilidades:', error);
      toast.error('Error al cargar las habilidades');
    } finally {
      setLoading(false);
    }
  };

  const handleHabilidadSelect = (habilidad: Habilidad) => {
    setSearchTerm(habilidad.name);
    setSelectedHabilidadData(habilidad);
    setShowDropdown(false);
    onHabilidadSelect(habilidad.id);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0 || habilidades.length > 0);
    
    if (!value) {
      setSelectedHabilidadData(null);
      onHabilidadSelect('');
    }
  };

  const handleClearSelection = () => {
    setSearchTerm('');
    setSelectedHabilidadData(null);
    setShowDropdown(false);
    onHabilidadSelect('');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  if (!pokemonId) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Habilidad
        </label>
        <div className="relative">
          <input
            type="text"
            disabled
            placeholder="Selecciona un Pokémon primero"
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
          />
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Habilidad
      </label>
      
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowDropdown(true)}
            placeholder={loading ? "Cargando habilidades..." : "Buscar habilidad..."}
            disabled={loading || habilidades.length === 0}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
          />
          <button
            type="button"
            onClick={toggleDropdown}
            disabled={loading || habilidades.length === 0}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Dropdown */}
        {showDropdown && !loading && filteredHabilidades.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredHabilidades.map((habilidad) => (
              <div
                key={habilidad.id}
                onClick={() => handleHabilidadSelect(habilidad)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {habilidad.name}
                  </span>
                  {habilidad.is_hidden && (
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                      Oculta
                    </span>
                  )}
                </div>
                {habilidad.description && (
                  <div className="text-sm text-gray-600 mt-1">
                    {habilidad.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Clear button */}
        {selectedHabilidadData && (
          <button
            type="button"
            onClick={handleClearSelection}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>
      
      {loading && (
        <div className="text-sm text-gray-500 mt-1">Cargando habilidades...</div>
      )}
      
      {!loading && habilidades.length === 0 && pokemonId && (
        <div className="text-sm text-gray-500 mt-1">No se encontraron habilidades</div>
      )}
      
      {!loading && showDropdown && filteredHabilidades.length === 0 && searchTerm && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
          <div className="text-sm text-gray-500">No se encontraron habilidades que coincidan con "{searchTerm}"</div>
        </div>
      )}
      
      {/* Descripción de la habilidad seleccionada */}
      {selectedHabilidadData && (
        <div className="mt-2">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="font-medium text-gray-900 mb-1">
              {selectedHabilidadData.name}
              {selectedHabilidadData.is_hidden && (
                <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                  Habilidad Oculta
                </span>
              )}
            </div>
            {selectedHabilidadData.description && (
              <div className="text-sm text-gray-600">
                {selectedHabilidadData.description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HabilidadSelector;