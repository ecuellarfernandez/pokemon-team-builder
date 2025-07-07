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
    const maxEVs = { hp: 252, atk: 252, def: 4, spa: 0, spd: 0, spe: 0 };
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
    hp: { text: 'text-red-600', bg: 'bg-red-500', light: 'bg-red-100' },
    atk: { text: 'text-orange-600', bg: 'bg-orange-500', light: 'bg-orange-100' },
    def: { text: 'text-yellow-600', bg: 'bg-yellow-500', light: 'bg-yellow-100' },
    spa: { text: 'text-blue-600', bg: 'bg-blue-500', light: 'bg-blue-100' },
    spd: { text: 'text-green-600', bg: 'bg-green-500', light: 'bg-green-100' },
    spe: { text: 'text-purple-600', bg: 'bg-purple-500', light: 'bg-purple-100' }
  };

  const getStatBarWidth = (value: number, maxValue: number = 255) => {
    return Math.min(100, (value / maxValue) * 100);
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
        <div className="space-y-4">
          {/* Botones de control */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              EVs Total: {getTotalEVs()}/508
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetEVs}
                className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              >
                Reset EVs
              </button>
              <button
                onClick={setMaxEVs}
                className="text-xs px-2 py-1 bg-blue-200 hover:bg-blue-300 rounded transition-colors"
              >
                Max EVs
              </button>
              <button
                onClick={setMaxIVs}
                className="text-xs px-2 py-1 bg-green-200 hover:bg-green-300 rounded transition-colors"
              >
                Max IVs
              </button>
            </div>
          </div>

          {/* Tabla de estadísticas */}
          {baseStats && finalStats && (
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="grid grid-cols-5 gap-2 p-3 bg-gray-50 border-b text-xs font-medium text-gray-700">
                <div></div>
                <div className="text-center">Base</div>
                <div className="text-center">EVs</div>
                <div className="text-center">IVs</div>
                <div className="text-center">Total</div>
              </div>
              
              {(Object.keys(baseStats) as Array<keyof BaseStats>).map((stat) => (
                <div key={stat} className="grid grid-cols-5 gap-2 p-3 border-b last:border-b-0 items-center">
                  {/* Nombre de la estadística */}
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${statColors[stat].text}`}>
                      {getStatName(stat)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {baseStats[stat]}
                    </span>
                  </div>
                  
                  {/* Barra de estadística base */}
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-3 relative">
                      <div 
                        className={`h-3 rounded-full ${statColors[stat].bg}`}
                        style={{ width: `${getStatBarWidth(baseStats[stat])}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Input EVs */}
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      max="252"
                      value={evs[stat]}
                      onChange={(e) => handleEVChange(stat, parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-center focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    />
                    {evs[stat] > 0 && (
                      <div className="ml-2 w-8 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${(evs[stat] / 252) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Input IVs */}
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      max="31"
                      value={ivs[stat]}
                      onChange={(e) => handleIVChange(stat, parseInt(e.target.value) || 0)}
                      className="w-12 px-2 py-1 border border-gray-300 rounded text-xs text-center focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    />
                    {ivs[stat] > 0 && (
                      <div className="ml-2 w-6 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${(ivs[stat] / 31) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Estadística final */}
                  <div className="text-center">
                    <span className="text-lg font-bold text-gray-900">
                      {finalStats[stat]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Barra de progreso de EVs */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  getTotalEVs() > 508 ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(100, (getTotalEVs() / 508) * 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-1 flex justify-between">
              <span>
                {getTotalEVs() > 508 && (
                  <span className="text-red-600">¡Excede el límite de EVs! </span>
                )}
                EVs restantes: {getRemainingEVs(evs)}
              </span>
              <span>{getTotalEVs()}/508</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsEditor;