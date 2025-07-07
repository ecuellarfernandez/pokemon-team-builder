import React, { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAuthHeaders } from '../../config/api';
import { API_CONFIG } from '../../config/api';

interface Naturaleza {
  id: string;
  name: string;
  stat_aumentada?: string;
  stat_disminuida?: string;
}

interface NaturalezaSelectorProps {
  selectedNaturaleza: string;
  onNaturalezaSelect: (natureId: string) => void;
}

const NaturalezaSelector: React.FC<NaturalezaSelectorProps> = ({
  selectedNaturaleza,
  onNaturalezaSelect
}) => {
  const [naturalezas, setNaturalezas] = useState<Naturaleza[]>([]);
  const [filteredNaturalezas, setFilteredNaturalezas] = useState<Naturaleza[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedNaturalezaData, setSelectedNaturalezaData] = useState<Naturaleza | null>(null);

  useEffect(() => {
    fetchNaturalezas();
  }, []);

  useEffect(() => {
    if (selectedNaturaleza && naturalezas.length > 0) {
      const naturaleza = naturalezas.find(n => n.id === selectedNaturaleza);
      setSelectedNaturalezaData(naturaleza || null);
      if (naturaleza) {
        setSearchTerm(naturaleza.name);
      }
    }
  }, [selectedNaturaleza, naturalezas]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = naturalezas.filter(naturaleza =>
        naturaleza.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNaturalezas(filtered);
    } else {
      setFilteredNaturalezas(naturalezas);
    }
  }, [searchTerm, naturalezas]);

  const fetchNaturalezas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/naturaleza`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setNaturalezas(data);
      } else {
        toast.error('Error al cargar las naturalezas');
      }
    } catch (error) {
      console.error('Error fetching naturalezas:', error);
      toast.error('Error al cargar las naturalezas');
    } finally {
      setLoading(false);
    }
  };

  const handleNaturalezaSelect = (naturaleza: Naturaleza) => {
    setSearchTerm(naturaleza.name);
    setSelectedNaturalezaData(naturaleza);
    setShowDropdown(false);
    onNaturalezaSelect(naturaleza.id);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0 || naturalezas.length > 0);
    
    if (!value) {
      setSelectedNaturalezaData(null);
      onNaturalezaSelect('');
    }
  };

  const handleClearSelection = () => {
    setSearchTerm('');
    setSelectedNaturalezaData(null);
    setShowDropdown(false);
    onNaturalezaSelect('');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const getStatDisplayName = (stat: string) => {
    const statNames: { [key: string]: string } = {
      'hp': 'HP',
      'attack': 'Ataque',
      'defense': 'Defensa',
      'special-attack': 'At. Esp.',
      'special-defense': 'Def. Esp.',
      'speed': 'Velocidad'
    };
    return statNames[stat] || stat;
  };

  const getNatureEffect = (naturaleza: Naturaleza) => {
    if (!naturaleza.stat_aumentada || !naturaleza.stat_disminuida) {
      return 'Neutral';
    }
    
    if (naturaleza.stat_aumentada === naturaleza.stat_disminuida) {
      return 'Neutral';
    }
    
    return `+${getStatDisplayName(naturaleza.stat_aumentada)} / -${getStatDisplayName(naturaleza.stat_disminuida)}`;
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Naturaleza
      </label>
      
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowDropdown(true)}
            placeholder={loading ? "Cargando naturalezas..." : "Buscar naturaleza..."}
            disabled={loading}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
          />
          <button
            type="button"
            onClick={toggleDropdown}
            disabled={loading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Dropdown */}
        {showDropdown && !loading && filteredNaturalezas.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredNaturalezas.map((naturaleza) => (
              <div
                key={naturaleza.id}
                onClick={() => handleNaturalezaSelect(naturaleza)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {naturaleza.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    {getNatureEffect(naturaleza)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clear button */}
        {selectedNaturalezaData && (
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
        <div className="text-sm text-gray-500 mt-1">Cargando naturalezas...</div>
      )}
      
      {!loading && showDropdown && filteredNaturalezas.length === 0 && searchTerm && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
          <div className="text-sm text-gray-500">No se encontraron naturalezas que coincidan con "{searchTerm}"</div>
        </div>
      )}
      
      {/* Información de la naturaleza seleccionada */}
      {selectedNaturalezaData && (
        <div className="mt-2">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="font-medium text-gray-900 mb-1">
              {selectedNaturalezaData.name}
            </div>
            <div className="text-sm text-gray-600">
              Efecto: {getNatureEffect(selectedNaturalezaData)}
            </div>
            {getNatureEffect(selectedNaturalezaData) !== 'Neutral' && (
              <div className="text-xs text-gray-500 mt-1">
                Esta naturaleza aumenta una estadística en 10% y reduce otra en 10%
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NaturalezaSelector;