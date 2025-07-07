import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getAuthHeaders } from '../../config/api';
import { API_CONFIG } from '../../config/api';

interface Naturaleza {
  id: string;
  name: string;
  increased_stat?: string;
  decreased_stat?: string;
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNaturalezas();
  }, []);

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

  const handleNaturalezaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onNaturalezaSelect(e.target.value);
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
    if (!naturaleza.increased_stat || !naturaleza.decreased_stat) {
      return 'Neutral';
    }
    
    if (naturaleza.increased_stat === naturaleza.decreased_stat) {
      return 'Neutral';
    }
    
    return `+${getStatDisplayName(naturaleza.increased_stat)} / -${getStatDisplayName(naturaleza.decreased_stat)}`;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Naturaleza
      </label>
      <select
        value={selectedNaturaleza}
        onChange={handleNaturalezaChange}
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
      >
        <option value="">Seleccionar naturaleza</option>
        {naturalezas.map((naturaleza) => (
          <option key={naturaleza.id} value={naturaleza.id}>
            {naturaleza.name} - {getNatureEffect(naturaleza)}
          </option>
        ))}
      </select>
      
      {loading && (
        <div className="text-sm text-gray-500 mt-1">Cargando naturalezas...</div>
      )}
      
      {/* Información de la naturaleza seleccionada */}
      {selectedNaturaleza && (
        <div className="mt-2">
          {(() => {
            const selectedNaturalezaData = naturalezas.find(n => n.id === selectedNaturaleza);
            if (selectedNaturalezaData) {
              const effect = getNatureEffect(selectedNaturalezaData);
              return (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="font-medium text-gray-900 mb-1">
                    {selectedNaturalezaData.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Efecto: {effect}
                  </div>
                  {effect !== 'Neutral' && (
                    <div className="text-xs text-gray-500 mt-1">
                      Esta naturaleza aumenta una estadística en 10% y reduce otra en 10%
                    </div>
                  )}
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

export default NaturalezaSelector;