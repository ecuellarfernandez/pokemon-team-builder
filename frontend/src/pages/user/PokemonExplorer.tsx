import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAuthHeaders } from '../../config/api';
import { API_CONFIG } from '../../config/api';
import Modal from '../../components/ui/Modal';

interface Pokemon {
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
  height?: number;
  weight?: number;
  description?: string;
}

interface Type {
  id: string;
  name: string;
}

const PokemonExplorer: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [showPokemonModal, setShowPokemonModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonsPerPage] = useState(20);

  useEffect(() => {
    fetchPokemons();
    fetchTypes();
  }, []);

  useEffect(() => {
    filterPokemons();
  }, [pokemons, searchTerm, selectedType]);

  const fetchPokemons = async () => {
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

  const fetchTypes = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/type`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setTypes(data);
      }
    } catch (error) {
      console.error('Error fetching types:', error);
    }
  };

  const filterPokemons = () => {
    let filtered = pokemons;

    // Filtrar por nombre
    if (searchTerm.trim()) {
      filtered = filtered.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por tipo
    if (selectedType) {
      filtered = filtered.filter(pokemon =>
        pokemon.type1.id === selectedType || pokemon.type2?.id === selectedType
      );
    }

    setFilteredPokemons(filtered);
    setCurrentPage(1); // Reset to first page when filtering
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

  const openPokemonModal = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setShowPokemonModal(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
  };

  // Pagination
  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemons = filteredPokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);
  const totalPages = Math.ceil(filteredPokemons.length / pokemonsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4">
                <div className="h-24 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Explorar Pokémon</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Filter className="h-5 w-5" />
          Filtros
        </button>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por nombre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Buscar Pokémon..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por tipo
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resultados */}
      <div className="mb-4">
        <p className="text-gray-600">
          Mostrando {currentPokemons.length} de {filteredPokemons.length} Pokémon
        </p>
      </div>

      {/* Grid de Pokémon */}
      {currentPokemons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron Pokémon con los filtros aplicados</p>
          <button
            onClick={clearFilters}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
            {currentPokemons.map((pokemon) => (
              <div
                key={pokemon.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => openPokemonModal(pokemon)}
              >
                {pokemon.sprite_url && (
                  <img
                    src={pokemon.sprite_url}
                    alt={pokemon.name}
                    className="w-24 h-24 mx-auto object-contain mb-3"
                  />
                )}
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  {pokemon.name}
                </h3>
                <div className="flex justify-center gap-1 mb-3">
                  <span className={`px-2 py-1 text-xs text-white rounded ${getTypeColor(pokemon.type1.name)}`}>
                    {pokemon.type1.name}
                  </span>
                  {pokemon.type2 && (
                    <span className={`px-2 py-1 text-xs text-white rounded ${getTypeColor(pokemon.type2.name)}`}>
                      {pokemon.type2.name}
                    </span>
                  )}
                </div>
                <div className="flex justify-center">
                  <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
                    <Eye className="h-4 w-4" />
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Anterior
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const pageNumber = Math.max(1, currentPage - 2) + index;
                  if (pageNumber > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`px-3 py-2 text-sm rounded-lg ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Siguiente
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Modal de detalles del Pokémon */}
      <Modal
        isOpen={showPokemonModal}
        onClose={() => setShowPokemonModal(false)}
        title={selectedPokemon?.name || ''}
        size="lg"
      >
        {selectedPokemon && (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              {selectedPokemon.sprite_url && (
                <img
                  src={selectedPokemon.sprite_url}
                  alt={selectedPokemon.name}
                  className="w-32 h-32 object-contain"
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPokemon.name}</h2>
                <div className="flex gap-2 mb-4">
                  <span className={`px-3 py-1 text-sm text-white rounded ${getTypeColor(selectedPokemon.type1.name)}`}>
                    {selectedPokemon.type1.name}
                  </span>
                  {selectedPokemon.type2 && (
                    <span className={`px-3 py-1 text-sm text-white rounded ${getTypeColor(selectedPokemon.type2.name)}`}>
                      {selectedPokemon.type2.name}
                    </span>
                  )}
                </div>
                {selectedPokemon.description && (
                  <p className="text-gray-600 mb-4">{selectedPokemon.description}</p>
                )}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedPokemon.height && (
                    <div>
                      <span className="font-medium text-gray-700">Altura:</span>
                      <span className="ml-2 text-gray-600">{selectedPokemon.height / 10} m</span>
                    </div>
                  )}
                  {selectedPokemon.weight && (
                    <div>
                      <span className="font-medium text-gray-700">Peso:</span>
                      <span className="ml-2 text-gray-600">{selectedPokemon.weight / 10} kg</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Estadísticas base */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Estadísticas Base</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{selectedPokemon.base_hp}</div>
                  <div className="text-sm text-gray-600">HP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{selectedPokemon.base_atk}</div>
                  <div className="text-sm text-gray-600">Ataque</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{selectedPokemon.base_def}</div>
                  <div className="text-sm text-gray-600">Defensa</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedPokemon.base_spa}</div>
                  <div className="text-sm text-gray-600">At. Esp.</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedPokemon.base_spd}</div>
                  <div className="text-sm text-gray-600">Def. Esp.</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedPokemon.base_spe}</div>
                  <div className="text-sm text-gray-600">Velocidad</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PokemonExplorer;