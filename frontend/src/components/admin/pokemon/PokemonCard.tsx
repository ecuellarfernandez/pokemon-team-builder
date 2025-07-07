import React from 'react';
import { Edit, Trash2, Zap as PokemonIcon } from 'lucide-react';
import { API_CONFIG } from '../../../config/api';

interface Pokemon {
  id: string;
  name: string;
  type_1_id: string;
  type_2_id?: string;
  base_hp: number;
  base_atk: number;
  base_def: number;
  base_spa: number;
  base_spd: number;
  base_spe: number;
  image_url?: string;
  type1?: {
    id: string;
    name: string;
  };
  type2?: {
    id: string;
    name: string;
  };
  created_at: string;
}

interface PokemonCardProps {
  pokemon: Pokemon;
  onEdit: (pokemon: Pokemon) => void;
  onDelete: (pokemonId: string) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-70 bg-gray-200 flex items-center justify-center">
        {pokemon.image_url ? (
          <img
            src={`${API_CONFIG.BASE_URL}${pokemon.image_url}`}
            alt={pokemon.name}
            className="select-none h-full w-full object-cover"
          />
        ) : (
          <PokemonIcon className="h-16 w-16 text-gray-400" />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{pokemon.name}</h3>
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {pokemon.type1?.name || 'Tipo 1'}
          </span>
          {pokemon.type2 && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {pokemon.type2.name}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-600 mb-3">
          <div className="grid grid-cols-3 gap-1">
            <div>HP: {pokemon.base_hp}</div>
            <div>ATK: {pokemon.base_atk}</div>
            <div>DEF: {pokemon.base_def}</div>
            <div>SPA: {pokemon.base_spa}</div>
            <div>SPD: {pokemon.base_spd}</div>
            <div>SPE: {pokemon.base_spe}</div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(pokemon)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(pokemon.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;