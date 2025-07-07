import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface PokemonFormData {
  pokemon_id: string;
  habilidad_id: string;
  movimiento_ids: string[];
}

export const usePokemonValidation = () => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateMovimientos = useCallback((movimientos: string[]): ValidationResult => {
    const errors: string[] = [];

    // Validar máximo 4 movimientos
    if (movimientos.length > 4) {
      errors.push('Un Pokémon no puede tener más de 4 movimientos');
    }

    // Validar mínimo 1 movimiento
    if (movimientos.length === 0) {
      errors.push('Un Pokémon debe tener al menos 1 movimiento');
    }

    // Validar movimientos duplicados
    const uniqueMovimientos = new Set(movimientos);
    if (uniqueMovimientos.size !== movimientos.length) {
      errors.push('No se pueden asignar movimientos duplicados al mismo Pokémon');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const validatePokemonForm = useCallback((formData: PokemonFormData): ValidationResult => {
    const errors: string[] = [];

    // Validar que se haya seleccionado un Pokémon
    if (!formData.pokemon_id) {
      errors.push('Debe seleccionar un Pokémon');
    }

    // Validar que se haya seleccionado una habilidad
    if (!formData.habilidad_id) {
      errors.push('Debe seleccionar una habilidad');
    }

    // Validar movimientos
    const movimientosValidation = validateMovimientos(formData.movimiento_ids);
    errors.push(...movimientosValidation.errors);

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [validateMovimientos]);

  const showValidationErrors = useCallback((errors: string[]) => {
    errors.forEach(error => {
      toast.error(error);
    });
    setValidationErrors(errors);
  }, []);

  const clearValidationErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);

  const validateAndShowErrors = useCallback((formData: PokemonFormData): boolean => {
    const validation = validatePokemonForm(formData);
    
    if (!validation.isValid) {
      showValidationErrors(validation.errors);
      return false;
    }
    
    clearValidationErrors();
    return true;
  }, [validatePokemonForm, showValidationErrors, clearValidationErrors]);

  const checkForDuplicateMovimiento = useCallback((currentMovimientos: string[], newMovimientoId: string): boolean => {
    if (currentMovimientos.includes(newMovimientoId)) {
      toast.error('Este movimiento ya está seleccionado');
      return true;
    }
    return false;
  }, []);

  const checkMaxMovimientos = useCallback((currentMovimientos: string[]): boolean => {
    if (currentMovimientos.length >= 4) {
      toast.error('Un Pokémon solo puede tener 4 movimientos');
      return true;
    }
    return false;
  }, []);

  return {
    validationErrors,
    validateMovimientos,
    validatePokemonForm,
    validateAndShowErrors,
    showValidationErrors,
    clearValidationErrors,
    checkForDuplicateMovimiento,
    checkMaxMovimientos
  };
};