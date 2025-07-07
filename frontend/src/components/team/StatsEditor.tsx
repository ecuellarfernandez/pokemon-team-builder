import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getAuthHeaders } from '../../config/api';
import { API_CONFIG } from '../../config/api';
import { 
  calculatePokemonStats, 
  validateEVs, 
  getRemainingEVs, 
  getStatName, 
  type BaseStats,
  type EVs,
  type IVs,
  type FinalStats,
  type Nature
} from '../../utils/pokemonStats';

interface StatsEditorProps {
  pokemonId: string;
  nivel: number;
  natureId: string;
  evs: EVs;
  ivs: IVs;
  onEVsChange: (evs: EVs) => void;
  onIVsChange: (ivs: IVs) => void;
}

const StatsEditor: React.FC<StatsEditorProps> = ({
  pokemonId,
  nivel,
  natureId,
  evs,
  ivs,
  onEVsChange,
  onIVsChange
}) => {
  const [baseStats, setBaseStats] = useState<BaseStats | null>(null);
  const [finalStats, setFinalStats] = useState<FinalStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pokemonId) {
      fetchBaseStats();
    }
  }, [pokemonId]);

  useEffect(() => {
    if (baseStats && pokemonId) {
      calculateFinalStats();
    }
  }, [baseStats, evs, ivs, nivel, natureId, pokemonId]);

  const fetchBaseStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pokemon/${pokemonId}`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const pokemon = await response.json();
        setBaseStats({
          hp: pokemon.base_hp,
          atk: pokemon.base_atk,
          def: pokemon.base_def,
          spa: pokemon.base_spa,
          spd: pokemon.base_spd,
          spe: pokemon.base_spe
        });
      } else {
        toast.error('Error al cargar las estadísticas base');
      }
    } catch (error) {
      console.error('Error fetching base stats:', error);
      toast.error('Error al cargar las estadísticas base');
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalStats = async () => {
    if (!baseStats) return;

    try {
      let nature: Nature | undefined;
      
      // Obtener información de la naturaleza si está disponible
      if (natureId) {
        try {
          const response = await fetch(`${API_CONFIG.BASE_URL}/naturaleza/${natureId}`, {
            headers: getAuthHeaders()
          });
          
          if (response.ok) {
            nature = await response.json();
          }
        } catch (error) {
          console.error('Error fetching nature:', error);
        }
      }

      // Usar la utilidad de cálculo de estadísticas
      const calculatedStats = calculatePokemonStats(baseStats, ivs, evs, nivel, nature);
      setFinalStats(calculatedStats);
    } catch (error) {
      console.error('Error calculating final stats:', error);
      toast.error('Error al calcular las estadísticas');
    }
  };

  const getTotalEVs = () => {
    return evs.hp + evs.atk + evs.def + evs.spa + evs.spd + evs.spe;
  };

  const handleEVChange = (stat: keyof EVs, value: number) => {
    const newValue = Math.max(0, Math.min(252, value));
    const newEVs = { ...evs, [stat]: newValue };
    
    if (validateEVs(newEVs)) {
      onEVsChange(newEVs);
    } else {
      toast.error('El total de EVs no puede exceder 508');
    }
  };

  const handleIVChange = (stat: keyof IVs, value: number) => {
    const newValue = Math.max(0, Math.min(31, value));
    const newIVs = { ...ivs, [stat]: newValue };
    onIVsChange(newIVs);
  };

  const setMaxEVs = () => {
    // Distribución estándar: 252/252/6 (dos stats principales + resto)
    const maxEVs = { hp: 252, atk: 252, def: 6, spa: 0, spd: 0, spe: 0 };
    onEVsChange(maxEVs);
  };

  const setMaxIVs = () => {
    const maxIVs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
    onIVsChange(maxIVs);
  };

  const resetEVs = () => {
    const resetEVs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
    onEVsChange(resetEVs);
  };

  const statColors = {
    hp: 'text-red-600',
    atk: 'text-orange-600',
    def: 'text-yellow-600',
    spa: 'text-blue-600',
    spd: 'text-green-600',
    spe: 'text-purple-600'
  };

  if (!pokemonId) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Estadísticas</h3>
        <div className="text-gray-500 text-center py-4">
          Selecciona un Pokémon para configurar las estadísticas
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-pulse text-gray-500">Cargando estadísticas...</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* EVs */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-900">
                EVs (Effort Values) - Total: {getTotalEVs()}/508
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={resetEVs}
                  className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                >
                  Resetear
                </button>
                <button
                  onClick={setMaxEVs}
                  className="text-xs px-2 py-1 bg-blue-200 hover:bg-blue-300 rounded transition-colors"
                >
                  Configuración típica
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.keys(evs) as Array<keyof EVs>).map((stat) => (
                <div key={stat}>
                  <label className={`block text-sm font-medium mb-1 ${statColors[stat]}`}>
                    {getStatName(stat)}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="252"
                    value={evs[stat]}
                    onChange={(e) => handleEVChange(stat, parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    getTotalEVs() > 508 ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, (getTotalEVs() / 508) * 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {getTotalEVs() > 508 && (
                  <span className="text-red-600">¡Excede el límite de EVs!</span>
                )}
                <span className="text-gray-500">EVs restantes: {getRemainingEVs(evs)}</span>
              </div>
            </div>
          </div>

          {/* IVs */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-900">
                IVs (Individual Values)
              </h4>
              <button
                onClick={setMaxIVs}
                className="text-xs px-2 py-1 bg-green-200 hover:bg-green-300 rounded transition-colors"
              >
                Máximo (31)
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.keys(ivs) as Array<keyof IVs>).map((stat) => (
                <div key={stat}>
                  <label className={`block text-sm font-medium mb-1 ${statColors[stat]}`}>
                    {getStatName(stat)}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="31"
                    value={ivs[stat]}
                    onChange={(e) => handleIVChange(stat, parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Estadísticas finales */}
          {finalStats && baseStats && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Estadísticas Finales (Nivel {nivel})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(Object.keys(finalStats) as Array<keyof FinalStats>).map((stat) => (
                  <div key={stat} className="bg-white rounded-lg p-3 border">
                    <div className={`text-sm font-medium ${statColors[stat]}`}>
                      {getStatName(stat)}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {finalStats[stat]}
                    </div>
                    <div className="text-xs text-gray-500">
                      Base: {baseStats[stat]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsEditor;