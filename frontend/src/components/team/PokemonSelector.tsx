import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAuthHeaders } from '../../config/api';
import { API_CONFIG } from '../../config/api';

interface Pokemon {
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
}

interface PokemonSelectorProps {
  selectedPokemon: string;
  onPokemonSelect: (pokemonId: string, pokemon?: Pokemon) => void;
}

const PokemonSelector: React.FC<PokemonSelectorProps> = ({
  selectedPokemon,
  onPokemonSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPokemonData, setSelectedPokemonData] = useState<Pokemon | null>(null);

  useEffect(() => {
    fetchPokemons();
  }, []);

  useEffect(() => {
    if (selectedPokemon && pokemons.length > 0) {
      const pokemon = pokemons.find(p => p.id === selectedPokemon);
      setSelectedPokemonData(pokemon || null);
      if (pokemon) {
        setSearchTerm(pokemon.name);
      }
    }
  }, [selectedPokemon, pokemons]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPokemons(filtered);
    } else {
      setFilteredPokemons([]);
    }
  }, [searchTerm, pokemons]);

  const fetchPokemons = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pokemon`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setPokemons(data);
      } else {
        toast.error('Error al cargar los Pokémon');
      }
    } catch (error) {
      console.error('Error fetching pokemons:', error);
      toast.error('Error al cargar los Pokémon');
    } finally {
      setLoading(false);
    }
  };

  const handlePokemonSelect = (pokemon: Pokemon) => {
    setSearchTerm(pokemon.name);
    setSelectedPokemonData(pokemon);
    setShowDropdown(false);
    onPokemonSelect(pokemon.id, pokemon);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    
    if (!value) {
      setSelectedPokemonData(null);
      onPokemonSelect('', undefined);
    }
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

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar Pokémon *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowDropdown(searchTerm.length > 0)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Busca un Pokémon por nombre..."
            disabled={loading}
          />
          
          {showDropdown && filteredPokemons.length > 0 && (
            <div className="absolute z-[60] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredPokemons.slice(0, 10).map((pokemon) => (
                <button
                  key={pokemon.id}
                  onClick={() => handlePokemonSelect(pokemon)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                >
                  {pokemon.image_url && (
                    <img
                      src={`${API_CONFIG.BASE_URL}${pokemon.image_url}`}
                      alt={pokemon.name}
                      className="w-8 h-8 object-contain"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{pokemon.name}</div>
                    <div className="flex gap-1 mt-1">
                      <span className={`px-2 py-1 text-xs text-white rounded ${getTypeColor(pokemon.type1.name)}`}>
                        {pokemon.type1.name}
                      </span>
                      {pokemon.type2 && (
                        <span className={`px-2 py-1 text-xs text-white rounded ${getTypeColor(pokemon.type2.name)}`}>
                          {pokemon.type2.name}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pokémon seleccionado */}
      {selectedPokemonData && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Pokémon Seleccionado</h3>
          <div className="flex items-center gap-4">
            {selectedPokemonData.image_url && (
              <img
                src={`${API_CONFIG.BASE_URL}${selectedPokemonData.image_url}`}
                alt={selectedPokemonData.name}
                className="w-16 h-16 object-contain"
              />
            )}
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900">{selectedPokemonData.name}</h4>
              <div className="flex gap-2 mt-2">
                <span className={`px-3 py-1 text-sm text-white rounded ${getTypeColor(selectedPokemonData.type1.name)}`}>
                  {selectedPokemonData.type1.name}
                </span>
                {selectedPokemonData.type2 && (
                  <span className={`px-3 py-1 text-sm text-white rounded ${getTypeColor(selectedPokemonData.type2.name)}`}>
                    {selectedPokemonData.type2.name}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-red-600">{selectedPokemonData.base_hp}</div>
                  <div className="text-gray-600">HP</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-orange-600">{selectedPokemonData.base_atk}</div>
                  <div className="text-gray-600">ATK</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-yellow-600">{selectedPokemonData.base_def}</div>
                  <div className="text-gray-600">DEF</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-600">{selectedPokemonData.base_spa}</div>
                  <div className="text-gray-600">SPA</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">{selectedPokemonData.base_spd}</div>
                  <div className="text-gray-600">SPD</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-600">{selectedPokemonData.base_spe}</div>
                  <div className="text-gray-600">SPE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonSelector;