import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pokemonId) {
      fetchHabilidades();
    }
  }, [pokemonId]);

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

  const handleHabilidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onHabilidadSelect(e.target.value);
  };

  if (!pokemonId) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Habilidad
        </label>
        <select
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
        >
          <option>Selecciona un Pokémon primero</option>
        </select>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Habilidad
      </label>
      <select
        value={selectedHabilidad}
        onChange={handleHabilidadChange}
        disabled={loading || habilidades.length === 0}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
      >
        <option value="">Seleccionar habilidad</option>
        {habilidades.map((habilidad) => (
          <option key={habilidad.id} value={habilidad.id}>
            {habilidad.name} {habilidad.is_hidden ? '(Oculta)' : ''}
          </option>
        ))}
      </select>
      
      {loading && (
        <div className="text-sm text-gray-500 mt-1">Cargando habilidades...</div>
      )}
      
      {!loading && habilidades.length === 0 && pokemonId && (
        <div className="text-sm text-gray-500 mt-1">No se encontraron habilidades</div>
      )}
      
      {/* Descripción de la habilidad seleccionada */}
      {selectedHabilidad && (
        <div className="mt-2">
          {(() => {
            const selectedHabilidadData = habilidades.find(h => h.id === selectedHabilidad);
            if (selectedHabilidadData?.description) {
              return (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="font-medium text-gray-900 mb-1">
                    {selectedHabilidadData.name}
                    {selectedHabilidadData.is_hidden && (
                      <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                        Habilidad Oculta
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedHabilidadData.description}
                  </div>
                </div>
              );
            }
            return null;
          })()} 
        </div>
      )}
    </div>
  );
};

export default HabilidadSelector;