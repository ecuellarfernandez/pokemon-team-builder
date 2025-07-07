/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Plus, Search, Zap as PokemonIcon } from 'lucide-react';
import { usePokemonAdmin } from '../../hooks/usePokemonAdmin';
import PokemonCard from '../../components/admin/pokemon/PokemonCard';
import PokemonForm from '../../components/admin/pokemon/PokemonForm';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const PokemonAdmin: React.FC = () => {
  const {
    pokemon,
    types,
    habilidades,
    movimientos,
    loading,
    formData,
    setFormData,
    imagePreview,
    errors,
    selectedPokemon,
    isDeleting,
    createPokemon,
    updatePokemon,
    deletePokemon,
    loadPokemonForEdit,
    resetForm,
    handleImageChange,
    handleHabilidadToggle,
    handleMovimientoToggle
  } = usePokemonAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pokemonToDelete, setPokemonToDelete] = useState<string | null>(null);

  const filteredPokemon = pokemon.filter(poke =>
    poke.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePokemon = async () => {
    const success = await createPokemon();
    if (success) {
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleUpdatePokemon = async () => {
    const success = await updatePokemon();
    if (success) {
      setShowEditModal(false);
      resetForm();
    }
  };

  const handleEditPokemon = async (poke: any) => {
    const success = await loadPokemonForEdit(poke);
    if (success) {
      setShowEditModal(true);
    }
  };

  const openDeleteConfirm = (pokemonId: string) => {
    setPokemonToDelete(pokemonId);
    setShowDeleteConfirm(true);
  };

  const handleDeletePokemon = async () => {
    if (!pokemonToDelete) return;
    
    const success = await deletePokemon(pokemonToDelete);
    if (success) {
      setShowDeleteConfirm(false);
      setPokemonToDelete(null);
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Pokemon</h1>
        <p className="text-gray-600">Administra los pokemon del sistema</p>
      </div>

      {/* Search and Create */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar pokemon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Crear Pokemon
        </button>
      </div>

      {/* Pokemon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPokemon.map((poke) => (
          <PokemonCard
            key={poke.id}
            pokemon={poke}
            onEdit={handleEditPokemon}
            onDelete={openDeleteConfirm}
          />
        ))}
      </div>
      
      {filteredPokemon.length === 0 && (
        <div className="text-center py-12">
          <PokemonIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No se encontraron pokemon</p>
        </div>
      )}

      {/* Create Pokemon Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        title="Crear Nuevo Pokemon"
        size="xl"
      >
        <PokemonForm
          formData={formData}
          setFormData={setFormData}
          types={types}
          habilidades={habilidades}
          movimientos={movimientos}
          errors={errors}
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          onHabilidadToggle={handleHabilidadToggle}
          onMovimientoToggle={handleMovimientoToggle}
        />
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleCloseCreateModal}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreatePokemon}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Crear Pokemon
          </button>
        </div>
      </Modal>

      {/* Edit Pokemon Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        title={`Editar Pokemon: ${selectedPokemon?.name || ''}`}
        size="xl"
      >
        <PokemonForm
          formData={formData}
          setFormData={setFormData}
          types={types}
          habilidades={habilidades}
          movimientos={movimientos}
          errors={errors}
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          onHabilidadToggle={handleHabilidadToggle}
          onMovimientoToggle={handleMovimientoToggle}
        />
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleCloseEditModal}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpdatePokemon}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Actualizar Pokemon
          </button>
        </div>
      </Modal>

      {/* Delete Pokemon Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setPokemonToDelete(null);
        }}
        onConfirm={handleDeletePokemon}
        title="Eliminar Pokemon"
        message="¿Estás seguro de que quieres eliminar este pokemon? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={isDeleting}
      />
    </div>
  );
};

export default PokemonAdmin;