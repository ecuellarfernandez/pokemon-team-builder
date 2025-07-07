import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAuthHeaders } from '../../config/api';
import { API_CONFIG } from '../../config/api';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import PokemonSelector from '../../components/team/PokemonSelector';
import PokemonCard from '../../components/team/PokemonCard';
import ItemSelector from '../../components/team/ItemSelector';
import HabilidadSelector from '../../components/team/HabilidadSelector';
import NaturalezaSelector from '../../components/team/NaturalezaSelector';
import MovimientosSelector from '../../components/team/MovimientosSelector';
import StatsEditor from '../../components/team/StatsEditor';
import PokemonFormValidator from '../../components/team/PokemonFormValidator';
import { usePokemonValidation } from '../../hooks/usePokemonValidation';

interface Equipo {
  id?: string;
  name: string;
  equipoPokemons: EquipoPokemon[];
}

interface EquipoPokemon {
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
}

interface PokemonForm {
  pokemon_id: string;
  nickname: string;
  nivel: number;
  movimientos: string[];
  item_id: string;
  habilidad_id: string;
  nature_id: string;
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
}

const EquipoEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== 'nuevo' ? true : false;
  const { validateAndShowErrors } = usePokemonValidation();

  const [equipo, setEquipo] = useState<Equipo>({
    name: '',
    equipoPokemons: []
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [showPokemonModal, setShowPokemonModal] = useState(false);
  const [editingPokemonIndex, setEditingPokemonIndex] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pokemonToDelete, setPokemonToDelete] = useState<number | null>(null);

  const [pokemonForm, setPokemonForm] = useState<PokemonForm>({
    pokemon_id: '',
    nickname: '',
    nivel: 100,
    movimientos: [],
    item_id: '',
    habilidad_id: '',
    nature_id: '',
    ev_hp: 0,
    ev_atk: 0,
    ev_def: 0,
    ev_spa: 0,
    ev_spd: 0,
    ev_spe: 0,
    iv_hp: 31,
    iv_atk: 31,
    iv_def: 31,
    iv_spa: 31,
    iv_spd: 31,
    iv_spe: 31
  });

  useEffect(() => {
    if (isEditing && id) {
      fetchEquipo();
    }
  }, [id, isEditing]);

  const fetchEquipo = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/equipo/${id}`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setEquipo(data);
      } else {
        toast.error('Error al cargar el equipo');
        navigate('/dashboard/equipos');
      }
    } catch (error) {
      console.error('Error fetching equipo:', error);
      toast.error('Error al cargar el equipo');
      navigate('/dashboard/equipos');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEquipo = async () => {
    if (!equipo.name.trim()) {
      toast.error('El nombre del equipo es requerido');
      return;
    }

    setSaving(true);
    try {
      const url = isEditing 
        ? `${API_CONFIG.BASE_URL}/equipo/${id}`
        : `${API_CONFIG.BASE_URL}/equipo`;
      
      const method = isEditing ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: equipo.name,
        })
      });

      if (response.ok) {
        const savedEquipo = await response.json();
        toast.success(isEditing ? 'Equipo actualizado' : 'Equipo creado');
        if (!isEditing) {
          // Actualizar el estado local con el equipo guardado
          setEquipo(prev => ({ ...prev, id: savedEquipo.id }));
          // Navegar a la ruta de edición con replace para evitar problemas de navegación
          navigate(`/dashboard/equipos/${savedEquipo.id}/editar`, { replace: true });
        }
      } else {
        toast.error('Error al guardar el equipo');
      }
    } catch (error) {
      console.error('Error saving equipo:', error);
      toast.error('Error al guardar el equipo');
    } finally {
      setSaving(false);
    }
  };

  const openAddPokemonModal = () => {
    if (equipo.equipoPokemons.length >= 6) {
      toast.error('Un equipo no puede tener más de 6 Pokémon');
      return;
    }
    
    if (!equipo.id) {
      toast.error('Debes guardar el equipo primero antes de agregar Pokémon');
      return;
    }
    
    setPokemonForm({
      pokemon_id: '',
      nickname: '',
      nivel: 100,
      movimientos: [],
      item_id: '',
      habilidad_id: '',
      nature_id: '',
      ev_hp: 0,
      ev_atk: 0,
      ev_def: 0,
      ev_spa: 0,
      ev_spd: 0,
      ev_spe: 0,
      iv_hp: 31,
      iv_atk: 31,
      iv_def: 31,
      iv_spa: 31,
      iv_spd: 31,
      iv_spe: 31
    });
    setEditingPokemonIndex(null);
    setShowPokemonModal(true);
  };

  const openEditModal = (index: number) => {
    const pokemon = equipo.equipoPokemons[index];
    setPokemonForm({
      pokemon_id: pokemon.pokemon_id,
      nickname: pokemon.nickname,
      nivel: pokemon.nivel,
      movimientos: pokemon.equipoPokemonMovimientos?.map(epm => epm.movimiento.id) || [],
      item_id: pokemon.item?.id || '',
      habilidad_id: pokemon.habilidad?.id || '',
      nature_id: pokemon.naturaleza?.id || '',
      ev_hp: pokemon.ev_hp,
      ev_atk: pokemon.ev_atk,
      ev_def: pokemon.ev_def,
      ev_spa: pokemon.ev_spa,
      ev_spd: pokemon.ev_spd,
      ev_spe: pokemon.ev_spe,
      iv_hp: pokemon.iv_hp,
      iv_atk: pokemon.iv_atk,
      iv_def: pokemon.iv_def,
      iv_spa: pokemon.iv_spa,
      iv_spd: pokemon.iv_spd,
      iv_spe: pokemon.iv_spe
    });
    setEditingPokemonIndex(index);
    setShowPokemonModal(true);
  };

  const savePokemon = async () => {
    // Validar usando el hook de validación
    const isValid = validateAndShowErrors({
      pokemon_id: pokemonForm.pokemon_id,
      habilidad_id: pokemonForm.habilidad_id,
      movimiento_ids: pokemonForm.movimientos
    });

    if (!isValid) {
      return;
    }

    if (!pokemonForm.nickname.trim()) {
      toast.error('El nickname es requerido');
      return;
    }

    if (!equipo.id) {
      toast.error('Debes guardar el equipo primero antes de agregar Pokémon');
      return;
    }

    try {
      const pokemonData = {
        pokemon_id: pokemonForm.pokemon_id,
        item_id: pokemonForm.item_id || '',
        habilidad_id: pokemonForm.habilidad_id || '',
        nature_id: pokemonForm.nature_id || '',
        nickname: pokemonForm.nickname,
        nivel: pokemonForm.nivel,
        ev_hp: pokemonForm.ev_hp,
        ev_atk: pokemonForm.ev_atk,
        ev_def: pokemonForm.ev_def,
        ev_spa: pokemonForm.ev_spa,
        ev_spd: pokemonForm.ev_spd,
        ev_spe: pokemonForm.ev_spe,
        iv_hp: pokemonForm.iv_hp,
        iv_atk: pokemonForm.iv_atk,
        iv_def: pokemonForm.iv_def,
        iv_spa: pokemonForm.iv_spa,
        iv_spd: pokemonForm.iv_spd,
        iv_spe: pokemonForm.iv_spe,
        movimiento_ids: pokemonForm.movimientos
      };

      const equipoId = equipo.id || id;
      let response;
      if (editingPokemonIndex !== null) {
        // Actualizar Pokémon existente
        const pokemonId = equipo.equipoPokemons[editingPokemonIndex].id;
        response = await fetch(`${API_CONFIG.BASE_URL}/equipo/pokemon/${pokemonId}`, {
          method: 'PATCH',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pokemonData)
        });
      } else {
        // Agregar nuevo Pokémon
        response = await fetch(`${API_CONFIG.BASE_URL}/equipo/${equipoId}/pokemon`, {
          method: 'POST',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pokemonData)
        });
      }

      if (response.ok) {
        toast.success(editingPokemonIndex !== null ? 'Pokémon actualizado' : 'Pokémon agregado');
        setShowPokemonModal(false);
        fetchEquipo(); // Recargar el equipo
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error al guardar el Pokémon');
      }
    } catch (error) {
      console.error('Error saving pokemon:', error);
      toast.error('Error al guardar el Pokémon');
    }
  };

  const deletePokemon = async () => {
    if (pokemonToDelete === null) return;

    try {
      const pokemonId = equipo.equipoPokemons[pokemonToDelete].id;
      const response = await fetch(`${API_CONFIG.BASE_URL}/equipo/pokemon/${pokemonId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        toast.success('Pokémon eliminado');
        fetchEquipo(); // Recargar el equipo
      } else {
        toast.error('Error al eliminar el Pokémon');
      }
    } catch (error) {
      console.error('Error deleting pokemon:', error);
      toast.error('Error al eliminar el Pokémon');
    } finally {
      setShowDeleteConfirm(false);
      setPokemonToDelete(null);
    }
  };

  const openDeleteConfirm = (index: number) => {
    setPokemonToDelete(index);
    setShowDeleteConfirm(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/equipos')}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Editar Equipo' : 'Nuevo Equipo'}
          </h1>
        </div>
        <button
          onClick={handleSaveEquipo}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Save className="h-5 w-5" />
          {saving ? 'Guardando...' : 'Guardar Equipo'}
        </button>
      </div>

      {/* Información del equipo */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Información del Equipo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Equipo *
            </label>
            <input
              type="text"
              value={equipo.name}
              onChange={(e) => setEquipo({ ...equipo, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa el nombre del equipo"
            />
          </div>
          
        </div>
      </div>

      {/* Lista de Pokémon */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Pokémon del Equipo ({equipo.equipoPokemons.length}/6)</h2>
          <button
            onClick={openAddPokemonModal}
            disabled={equipo.equipoPokemons.length >= 6 || !equipo.id}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Agregar Pokémon
          </button>
        </div>

        {equipo.equipoPokemons.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No hay Pokémon en este equipo</p>
            {equipo.id && (
              <button
                onClick={openAddPokemonModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Agregar Primer Pokémon
              </button>
            )}
            {!equipo.id && (
              <p className="text-gray-500 text-sm mt-2">
                Guarda el equipo primero para poder agregar Pokémon
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipo.equipoPokemons.map((pokemon, index) => (
              <div key={pokemon.id} className="relative">
                <PokemonCard pokemon={pokemon} />
                {equipo.id && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => openEditModal(index)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded"
                      title="Editar Pokémon"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(index)}
                      className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                      title="Eliminar Pokémon"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para agregar/editar Pokémon */}
      <Modal
        isOpen={showPokemonModal}
        onClose={() => setShowPokemonModal(false)}
        title={editingPokemonIndex !== null ? 'Editar Pokémon' : 'Agregar Pokémon'}
        size="xl"
      >
        <div className="space-y-6">
          {/* Selector de Pokémon */}
          <PokemonSelector
            selectedPokemon={pokemonForm.pokemon_id}
            excludePokemonIds={equipo.equipoPokemons
              .filter((_, index) => index !== editingPokemonIndex)
              .map(ep => ep.pokemon_id)
            }
            onPokemonSelect={(pokemonId, pokemon) => {
              setPokemonForm({
              ...pokemonForm,
              pokemon_id: pokemonId,
              nickname: pokemon?.name || ''
            });
            }}
          />

          {pokemonForm.pokemon_id && (
            <>
              {/* Validador de formulario */}
              <PokemonFormValidator
                pokemonId={pokemonForm.pokemon_id}
                habilidadId={pokemonForm.habilidad_id}
                movimientoIds={pokemonForm.movimientos}
                showValidation={true}
              />
              
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nickname *
                  </label>
                  <input
                    type="text"
                    value={pokemonForm.nickname}
                    onChange={(e) => setPokemonForm({ ...pokemonForm, nickname: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nickname del Pokémon"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={pokemonForm.nivel}
                    onChange={(e) => setPokemonForm({ ...pokemonForm, nivel: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Selectores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ItemSelector
                  selectedItem={pokemonForm.item_id}
                  onItemSelect={(itemId) => setPokemonForm({ ...pokemonForm, item_id: itemId })}
                />
                <HabilidadSelector
                  pokemonId={pokemonForm.pokemon_id}
                  selectedHabilidad={pokemonForm.habilidad_id}
                  onHabilidadSelect={(habilidadId) => setPokemonForm({ ...pokemonForm, habilidad_id: habilidadId })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NaturalezaSelector
                  selectedNaturaleza={pokemonForm.nature_id}
                  onNaturalezaSelect={(natureId) => setPokemonForm({ ...pokemonForm, nature_id: natureId })}
                />
                <MovimientosSelector
                  pokemonId={pokemonForm.pokemon_id}
                  selectedMovimientos={pokemonForm.movimientos}
                  onMovimientosChange={(movimientos) => setPokemonForm({ ...pokemonForm, movimientos })}
                />
              </div>

              {/* Editor de stats */}
              <StatsEditor
                pokemonId={pokemonForm.pokemon_id}
                nivel={pokemonForm.nivel}
                natureId={pokemonForm.nature_id}
                evs={{
                  hp: pokemonForm.ev_hp,
                  atk: pokemonForm.ev_atk,
                  def: pokemonForm.ev_def,
                  spa: pokemonForm.ev_spa,
                  spd: pokemonForm.ev_spd,
                  spe: pokemonForm.ev_spe
                }}
                ivs={{
                  hp: pokemonForm.iv_hp,
                  atk: pokemonForm.iv_atk,
                  def: pokemonForm.iv_def,
                  spa: pokemonForm.iv_spa,
                  spd: pokemonForm.iv_spd,
                  spe: pokemonForm.iv_spe
                }}
                onEVsChange={(evs) => setPokemonForm({
                  ...pokemonForm,
                  ev_hp: evs.hp,
                  ev_atk: evs.atk,
                  ev_def: evs.def,
                  ev_spa: evs.spa,
                  ev_spd: evs.spd,
                  ev_spe: evs.spe
                })}
                onIVsChange={(ivs) => setPokemonForm({
                  ...pokemonForm,
                  iv_hp: ivs.hp,
                  iv_atk: ivs.atk,
                  iv_def: ivs.def,
                  iv_spa: ivs.spa,
                  iv_spd: ivs.spd,
                  iv_spe: ivs.spe
                })}
              />

              {/* Botones */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowPokemonModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={savePokemon}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editingPokemonIndex !== null ? 'Actualizar' : 'Agregar'} Pokémon
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={deletePokemon}
        title="Eliminar Pokémon"
        message="¿Estás seguro de que quieres eliminar este Pokémon del equipo?"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default EquipoEditor;