// Fórmula oficial de cálculo de estadísticas de Pokémon

export interface BaseStats {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface IVs {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface EVs {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface Nature {
  stat_aumentada?: string;
  stat_disminuida?: string;
}

export interface FinalStats {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

/**
 * Calcula las estadísticas finales de un Pokémon usando la fórmula oficial
 * 
 * Fórmula para HP:
 * HP = floor(((2 * Base + IV + floor(EV / 4)) * Level) / 100) + Level + 10
 * 
 * Fórmula para otras estadísticas:
 * Stat = floor((floor(((2 * Base + IV + floor(EV / 4)) * Level) / 100) + 5) * Nature)
 * 
 * @param baseStats - Estadísticas base del Pokémon
 * @param ivs - Individual Values (0-31)
 * @param evs - Effort Values (0-252, máximo 508 total)
 * @param level - Nivel del Pokémon (1-100)
 * @param nature - Naturaleza del Pokémon (opcional)
 * @returns Estadísticas finales calculadas
 */
export const calculatePokemonStats = (
  baseStats: BaseStats,
  ivs: IVs,
  evs: EVs,
  level: number,
  nature?: Nature
): FinalStats => {
  // Validar que el nivel esté en el rango correcto
  if (level < 1 || level > 100) {
    throw new Error('El nivel debe estar entre 1 y 100');
  }

  // Validar IVs (0-31)
  Object.values(ivs).forEach(iv => {
    if (iv < 0 || iv > 31) {
      throw new Error('Los IVs deben estar entre 0 y 31');
    }
  });

  // Validar EVs (0-252 individual, máximo 508 total)
  const totalEVs = Object.values(evs).reduce((sum, ev) => sum + ev, 0);
  if (totalEVs > 508) {
    throw new Error('El total de EVs no puede exceder 508');
  }
  
  Object.values(evs).forEach(ev => {
    if (ev < 0 || ev > 252) {
      throw new Error('Los EVs individuales deben estar entre 0 y 252');
    }
  });

  // Obtener modificadores de naturaleza
  const getNatureModifier = (stat: string): number => {
    if (!nature || !nature.stat_aumentada || !nature.stat_disminuida) {
      return 1.0;
    }
    
    if (nature.stat_aumentada === nature.stat_disminuida) {
      return 1.0; // Naturaleza neutral
    }
    
    if (stat === nature.stat_aumentada) {
      return 1.1; // +10%
    }
    
    if (stat === nature.stat_disminuida) {
      return 0.9; // -10%
    }
    
    return 1.0;
  };

  // Calcular HP (fórmula especial)
  const hp = Math.floor(((2 * baseStats.hp + ivs.hp + Math.floor(evs.hp / 4)) * level) / 100) + level + 10;

  // Calcular otras estadísticas
  const calculateStat = (baseStat: number, iv: number, ev: number, statName: string): number => {
    const basePart = Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + 5;
    const natureModifier = getNatureModifier(statName);
    return Math.floor(basePart * natureModifier);
  };

  return {
    hp,
    atk: calculateStat(baseStats.atk, ivs.atk, evs.atk, 'atk'),
    def: calculateStat(baseStats.def, ivs.def, evs.def, 'def'),
    spa: calculateStat(baseStats.spa, ivs.spa, evs.spa, 'spa'),
    spd: calculateStat(baseStats.spd, ivs.spd, evs.spd, 'spd'),
    spe: calculateStat(baseStats.spe, ivs.spe, evs.spe, 'spe')
  };
};

/**
 * Valida que los EVs totales no excedan 508
 */
export const validateEVs = (evs: EVs): boolean => {
  const total = Object.values(evs).reduce((sum, ev) => sum + ev, 0);
  return total <= 508;
};

/**
 * Calcula los EVs restantes disponibles
 */
export const getRemainingEVs = (evs: EVs): number => {
  const total = Object.values(evs).reduce((sum, ev) => sum + ev, 0);
  return Math.max(0, 508 - total);
};

/**
 * Obtiene el nombre de la estadística en español
 */
export const getStatName = (stat: string): string => {
  const statNames: { [key: string]: string } = {
    hp: 'HP',
    atk: 'Ataque',
    def: 'Defensa',
    spa: 'At. Esp.',
    spd: 'Def. Esp.',
    spe: 'Velocidad'
  };
  return statNames[stat] || stat;
};

/**
 * Obtiene el color de la estadística según su valor
 */
export const getStatColor = (value: number, maxValue: number = 255): string => {
  const percentage = (value / maxValue) * 100;
  
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-yellow-600';
  if (percentage >= 40) return 'text-orange-600';
  return 'text-red-600';
};