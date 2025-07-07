/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAuthHeaders } from '../../config/api';
import { API_CONFIG } from '../../config/api';
import { usePokemonValidation } from '../../hooks/usePokemonValidation';

interface Movimiento {
  id: string;
  name: string;
  type: { id: string; name: string };
  category: string;
  power?: number;
  accuracy?: number;
  pp: number;
  description?: string;
}

interface MovimientosSelectorProps {
  pokemonId: string;
  selectedMovimientos: string[];
  onMovimientosChange: (movimientos: string[]) => void;
}

const MovimientosSelector: React.FC<MovimientosSelectorProps> = ({
  pokemonId,
  selectedMovimientos,
  onMovimientosChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [filteredMovimientos, setFilteredMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { checkForDuplicateMovimiento, checkMaxMovimientos } = usePokemonValidation();

  useEffect(() => {
    if (pokemonId) {
      fetchMovimientos();
    } else {
      setMovimientos([]);
      setFilteredMovimientos([]);
    }
  }, [pokemonId]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = movimientos.filter(movimiento =>
        movimiento.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedMovimientos.includes(movimiento.id)
      );
      setFilteredMovimientos(filtered);
    } else {
      setFilteredMovimientos([]);
    }
  }, [searchTerm, movimientos, selectedMovimientos]);

  const fetchMovimientos = async (searchTerm: string = '') => {
    if (!pokemonId) return;
    
    setLoading(true);
    try {
      // Obtener movimientos específicos del Pokémon
      const response = await fetch(`${API_CONFIG.BASE_URL}/pokemon/${pokemonId}/movimientos`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        // Filtrar por término de búsqueda si existe
        const filteredData = searchTerm 
          ? data.filter((mov: any) => mov.name.toLowerCase().includes(searchTerm.toLowerCase()))
          : data;
        setMovimientos(filteredData);
      } else {
        toast.error('Error al cargar los movimientos');
      }
    } catch (error) {
      console.error('Error fetching movimientos:', error);
      toast.error('Error al cargar los movimientos');
    } finally {
      setLoading(false);
    }
  };

  const handleMovimientoAdd = (movimiento: Movimiento) => {
    // Validar máximo de movimientos
    if (checkMaxMovimientos(selectedMovimientos)) {
      return;
    }
    
    // Validar movimientos duplicados
    if (checkForDuplicateMovimiento(selectedMovimientos, movimiento.id)) {
      return;
    }
    
    const newMovimientos = [...selectedMovimientos, movimiento.id];
    onMovimientosChange(newMovimientos);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleMovimientoRemove = (movimientoId: string) => {
    const newMovimientos = selectedMovimientos.filter(id => id !== movimientoId);
    onMovimientosChange(newMovimientos);
  };

  const getSelectedMovimientosData = () => {
    return selectedMovimientos.map(id => movimientos.find(m => m.id === id)).filter(Boolean) as Movimiento[];
  };

  const getTypeColor = (typeName: string) => {
    const colors: { [key: string]: string } = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-300',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-green-400',
      rock: 'bg-yellow-800',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300'
    };
    return colors[typeName.toLowerCase()] || 'bg-gray-400';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      physical: 'text-red-600',
      special: 'text-blue-600',
      status: 'text-gray-600'
    };
    return colors[category.toLowerCase()] || 'text-gray-600';
  };

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      physical: 'Físico',
      special: 'Especial',
      status: 'Estado'
    };
    return names[category.toLowerCase()] || category;
  };

  if (!pokemonId) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Movimientos (0/4)
        </label>
        <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-center">
          Selecciona un Pokémon primero
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Movimientos ({selectedMovimientos.length}/4)
        </label>
        
        {selectedMovimientos.length < 4 && (
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(e.target.value.length > 0);
              }}
              onFocus={() => setShowDropdown(searchTerm.length > 0)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Buscar movimiento..."
              disabled={loading}
            />
            
            {showDropdown && filteredMovimientos.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredMovimientos.slice(0, 10).map((movimiento) => (
                  <button
                    key={movimiento.id}
                    onClick={() => handleMovimientoAdd(movimiento)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{movimiento.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 text-xs text-white rounded ${getTypeColor(movimiento.type.name)}`}>
                            {movimiento.type.name}
                          </span>
                          <span className={`text-xs font-medium ${getCategoryColor(movimiento.category)}`}>
                            {getCategoryName(movimiento.category)}
                          </span>
                          {movimiento.power && (
                            <span className="text-xs text-gray-600">
                              Poder: {movimiento.power}
                            </span>
                          )}
                        </div>
                      </div>
                      <Plus className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {loading && (
          <div className="text-sm text-gray-500 mb-3">Cargando movimientos...</div>
        )}
      </div>

      {/* Movimientos seleccionados */}
      <div className="space-y-2">
        {getSelectedMovimientosData().map((movimiento) => (
          <div key={movimiento.id} className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{movimiento.name}</span>
                  <span className={`px-2 py-1 text-xs text-white rounded ${getTypeColor(movimiento.type.name)}`}>
                    {movimiento.type.name}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className={`font-medium ${getCategoryColor(movimiento.category)}`}>
                    {getCategoryName(movimiento.category)}
                  </span>
                  {movimiento.power && (
                    <span>Poder: {movimiento.power}</span>
                  )}
                  {movimiento.accuracy && (
                    <span>Precisión: {movimiento.accuracy}%</span>
                  )}
                  <span>PP: {movimiento.pp}</span>
                </div>
                {movimiento.description && (
                  <div className="text-sm text-gray-500 mt-1">
                    {movimiento.description}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleMovimientoRemove(movimiento.id)}
                className="text-red-600 hover:text-red-800 p-1"
                title="Eliminar movimiento"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        
        {selectedMovimientos.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No hay movimientos seleccionados
          </div>
        )}
      </div>
    </div>
  );
};

export default MovimientosSelector;