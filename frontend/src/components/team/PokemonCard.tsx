import React from 'react';
import { API_CONFIG } from '../../config/api';
import { calculatePokemonStats, type BaseStats, type EVs, type IVs, type Nature } from '../../utils/pokemonStats';

interface PokemonCardProps {
  pokemon: {
    id: string;
    pokemon_id: string;
    nickname: string;
    nivel: number;
    equipoPokemonMovimientos: { movimiento: { id: string; name: string } }[];
    pokemon: {
      id: string;
      name: string;
      image_url?: string;
      type1: { id: string; name: string };
      type2?: { id: string; name: string };
      base_hp: number;
      base_atk: number;
      base_def: number;
      base_spa: number;
      base_spd: number;
      base_spe: number;
    };
    item?: {
      id: string;
      name: string;
      image_url?: string;
    };
    habilidad?: {
      id: string;
      name: string;
    };
    naturaleza?: {
      id: string;
      name: string;
      stat_aumentada?: string;
      stat_disminuida?: string;
    };
    ev_hp: number;
    ev_atk: number;
    ev_def: number;
    ev_spa: number;
    ev_spd: number;
    ev_spe: number;
    iv_hp: number;
    iv_atk: number;
    iv_def: number;
    iv_spa: number;
    iv_spd: number;
    iv_spe: number;
  };
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
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

  // Preparar datos para el cálculo de estadísticas
  const baseStats: BaseStats = {
    hp: pokemon.pokemon.base_hp,
    atk: pokemon.pokemon.base_atk,
    def: pokemon.pokemon.base_def,
    spa: pokemon.pokemon.base_spa,
    spd: pokemon.pokemon.base_spd,
    spe: pokemon.pokemon.base_spe
  };

  const ivs: IVs = {
    hp: pokemon.iv_hp,
    atk: pokemon.iv_atk,
    def: pokemon.iv_def,
    spa: pokemon.iv_spa,
    spd: pokemon.iv_spd,
    spe: pokemon.iv_spe
  };

  const evs: EVs = {
    hp: pokemon.ev_hp,
    atk: pokemon.ev_atk,
    def: pokemon.ev_def,
    spa: pokemon.ev_spa,
    spd: pokemon.ev_spd,
    spe: pokemon.ev_spe
  };

  const nature: Nature | undefined = pokemon.naturaleza ? {
    stat_aumentada: pokemon.naturaleza.stat_aumentada,
    stat_disminuida: pokemon.naturaleza.stat_disminuida
  } : undefined;

  // Calcular estadísticas finales usando la fórmula oficial
  const finalStats = calculatePokemonStats(baseStats, ivs, evs, pokemon.nivel, nature);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      {/* Header con imagen y nombre */}
      <div className="flex items-center gap-3 mb-3">
        {pokemon.pokemon.image_url && (
          <img
            src={`${API_CONFIG.BASE_URL}${pokemon.pokemon.image_url}`}
            alt={pokemon.pokemon.name}
            className="w-16 h-16 object-contain"
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{pokemon.nickname}</h3>
          <p className="text-sm text-gray-600">{pokemon.pokemon.name}</p>
          <p className="text-sm text-gray-500">Nivel {pokemon.nivel}</p>
        </div>
      </div>

      {/* Tipos */}
      <div className="flex gap-2 mb-3">
        <span className={`px-3 py-1 text-sm text-white rounded ${getTypeColor(pokemon.pokemon.type1.name)}`}>
          {pokemon.pokemon.type1.name}
        </span>
        {pokemon.pokemon.type2 && (
          <span className={`px-3 py-1 text-sm text-white rounded ${getTypeColor(pokemon.pokemon.type2.name)}`}>
            {pokemon.pokemon.type2.name}
          </span>
        )}
      </div>

      {/* Ítem y Habilidad */}
      <div className="space-y-2 mb-3">
        {pokemon.item && (
          <div className="flex items-center gap-2">
            {pokemon.item.image_url && (
              <img
                src={`${API_CONFIG.BASE_URL}${pokemon.item.image_url}`}
                alt={pokemon.item.name}
                className="w-4 h-4 object-contain"
              />
            )}
            <span className="text-sm text-gray-700">{pokemon.item.name}</span>
          </div>
        )}
        {pokemon.habilidad && (
          <div className="text-sm text-gray-700">
            <span className="font-medium">Habilidad:</span> {pokemon.habilidad.name}
          </div>
        )}
        {pokemon.naturaleza && (
          <div className="text-sm text-gray-700">
            <span className="font-medium">Naturaleza:</span> {pokemon.naturaleza.name}
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Estadísticas</h4>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-semibold text-red-600">{finalStats.hp}</div>
            <div className="text-gray-600">HP</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-orange-600">{finalStats.atk}</div>
            <div className="text-gray-600">ATK</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-yellow-600">{finalStats.def}</div>
            <div className="text-gray-600">DEF</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-blue-600">{finalStats.spa}</div>
            <div className="text-gray-600">SPA</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-green-600">{finalStats.spd}</div>
            <div className="text-gray-600">SPD</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-purple-600">{finalStats.spe}</div>
            <div className="text-gray-600">SPE</div>
          </div>
        </div>
      </div>

      {/* Movimientos */}
      {pokemon.equipoPokemonMovimientos && pokemon.equipoPokemonMovimientos.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Movimientos</h4>
          <div className="space-y-1">
            {pokemon.equipoPokemonMovimientos.map((epm, index) => (
              <div key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                {epm.movimiento.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonCard;