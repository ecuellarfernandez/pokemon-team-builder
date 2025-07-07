import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAuthHeaders } from '../../config/api';
import { API_CONFIG } from '../../config/api';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

interface Equipo {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  equipoPokemons: EquipoPokemon[];
}

interface EquipoPokemon {
  id: string;
  nickname: string;
  nivel: number;
  pokemon: {
    id: string;
    name: string;
    image_url?: string;
    type1: { id: string; name: string };
    type2?: { id: string; name: string };
  };
}

const EquiposList: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [equipoToDelete, setEquipoToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchEquipos();
  }, []);

  const fetchEquipos = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/equipo`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setEquipos(data);
      } else {
        toast.error('Error al cargar los equipos');
      }
    } catch (error) {
      console.error('Error fetching equipos:', error);
      toast.error('Error al cargar los equipos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEquipo = async () => {
    if (!equipoToDelete) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/equipo/${equipoToDelete}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        toast.success('Equipo eliminado exitosamente');
        setEquipos(equipos.filter(equipo => equipo.id !== equipoToDelete));
      } else {
        toast.error('Error al eliminar el equipo');
      }
    } catch (error) {
      console.error('Error deleting equipo:', error);
      toast.error('Error al eliminar el equipo');
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
      setEquipoToDelete(null);
    }
  };

  const openDeleteConfirm = (equipoId: string) => {
    setEquipoToDelete(equipoId);
    setShowDeleteConfirm(true);
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mis Equipos</h1>
        <Link
          to="/dashboard/equipos/nuevo"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nuevo Equipo
        </Link>
      </div>

      {equipos.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes equipos</h3>
          <p className="text-gray-600 mb-6">Crea tu primer equipo Pokémon para comenzar</p>
          <Link
            to="/dashboard/equipos/nuevo"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Crear Primer Equipo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipos.map((equipo) => (
            <div key={equipo.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{equipo.name}</h3>
                  <div className="flex gap-2">
                    <Link
                      to={`/dashboard/equipos/${equipo.id}/editar`}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Editar equipo"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => openDeleteConfirm(equipo.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Eliminar equipo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {equipo.description && (
                  <p className="text-gray-600 mb-4">{equipo.description}</p>
                )}

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Pokémon: {equipo.equipoPokemons.length}/6
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {equipo.equipoPokemons.slice(0, 6).map((equipoPokemon) => (
                      <div key={equipoPokemon.id} className="flex items-center bg-gray-100 rounded-lg p-2">
                        {equipoPokemon.pokemon.image_url && (
                          <img
                            src={equipoPokemon.pokemon.image_url}
                            alt={equipoPokemon.pokemon.name}
                            className="w-8 h-8 mr-2"
                          />
                        )}
                        <div>
                          <p className="text-xs font-medium">{equipoPokemon.nickname}</p>
                          <div className="flex gap-1">
                            <span className={`text-xs px-1 py-0.5 rounded text-white ${getTypeColor(equipoPokemon.pokemon.type1.name)}`}>
                              {equipoPokemon.pokemon.type1.name}
                            </span>
                            {equipoPokemon.pokemon.type2 && (
                              <span className={`text-xs px-1 py-0.5 rounded text-white ${getTypeColor(equipoPokemon.pokemon.type2.name)}`}>
                                {equipoPokemon.pokemon.type2.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  Creado: {new Date(equipo.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteEquipo}
        title="Eliminar Equipo"
        message="¿Estás seguro de que quieres eliminar este equipo? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={deleteLoading}
      />
    </div>
  );
};

export default EquiposList;