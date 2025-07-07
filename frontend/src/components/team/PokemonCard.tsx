import React from 'react';

interface PokemonCardProps {
  pokemon: {
    id: string;
    pokemon_id: string;
    apodo: string;
    nivel: number;
    movimientos: string[];
    pokemon: {
      id: string;
      name: string;
      sprite_url?: string;
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
      sprite_url?: string;
    };
    habilidad?: {
      id: string;
      name: string;
    };
    naturaleza?: {
      id: string;
      name: string;
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

  const calculateFinalStat = (base: number, iv: number, ev: number, level: number, isHP: boolean = false) => {
    if (isHP) {
      return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
    } else {
      return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5;
    }
  };

  const finalStats = {
    hp: calculateFinalStat(pokemon.pokemon.base_hp, pokemon.iv_hp, pokemon.ev_hp, pokemon.nivel, true),
    atk: calculateFinalStat(pokemon.pokemon.base_atk, pokemon.iv_atk, pokemon.ev_atk, pokemon.nivel),
    def: calculateFinalStat(pokemon.pokemon.base_def, pokemon.iv_def, pokemon.ev_def, pokemon.nivel),
    spa: calculateFinalStat(pokemon.pokemon.base_spa, pokemon.iv_spa, pokemon.ev_spa, pokemon.nivel),
    spd: calculateFinalStat(pokemon.pokemon.base_spd, pokemon.iv_spd, pokemon.ev_spd, pokemon.nivel),
    spe: calculateFinalStat(pokemon.pokemon.base_spe, pokemon.iv_spe, pokemon.ev_spe, pokemon.nivel)
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      {/* Header con imagen y nombre */}
      <div className="flex items-center gap-3 mb-3">
        {pokemon.pokemon.sprite_url && (
          <img
            src={pokemon.pokemon.sprite_url}
            alt={pokemon.pokemon.name}
            className="w-16 h-16 object-contain"
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{pokemon.apodo}</h3>
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
            {pokemon.item.sprite_url && (
              <img
                src={pokemon.item.sprite_url}
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
      {pokemon.movimientos && pokemon.movimientos.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Movimientos</h4>
          <div className="text-xs text-gray-600">
            {pokemon.movimientos.length} movimiento{pokemon.movimientos.length !== 1 ? 's' : ''} configurado{pokemon.movimientos.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonCard;