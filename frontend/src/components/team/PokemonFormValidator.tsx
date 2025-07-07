import React from 'react';
import ValidationMessage from '../ui/ValidationMessage';
import { usePokemonValidation } from '../../hooks/usePokemonValidation';

interface PokemonFormValidatorProps {
  pokemonId: string;
  habilidadId: string;
  movimientoIds: string[];
  showValidation?: boolean;
}

const PokemonFormValidator: React.FC<PokemonFormValidatorProps> = ({
  pokemonId,
  habilidadId,
  movimientoIds,
  showValidation = true
}) => {
  const { validatePokemonForm } = usePokemonValidation();

  if (!showValidation) return null;

  const validation = validatePokemonForm({
    pokemon_id: pokemonId,
    habilidad_id: habilidadId,
    movimiento_ids: movimientoIds
  });

  if (validation.isValid) {
    return (
      <ValidationMessage 
        type="success" 
        message="✓ Configuración de Pokémon válida" 
        className="mb-4"
      />
    );
  }

  return (
    <div className="space-y-2 mb-4">
      {validation.errors.map((error, index) => (
        <ValidationMessage 
          key={index}
          type="error" 
          message={error}
        />
      ))}
    </div>
  );
};

export default PokemonFormValidator;