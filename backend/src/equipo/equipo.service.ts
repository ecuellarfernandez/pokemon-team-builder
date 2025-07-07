import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Equipo,
  EquipoPokemon,
  EquipoPokemonMovimiento,
  PokemonMovimiento,
  PokemonHabilidad,
} from '../entities';
import { CreateEquipoDto } from '../dto/equipo/create-equipo.dto';
import { UpdateEquipoDto } from '../dto/equipo/update-equipo.dto';
import { CreateEquipoPokemonDto } from '../dto/equipo-pokemon/create-equipo-pokemon.dto';
import { UpdateEquipoPokemonDto } from '../dto/equipo-pokemon/update-equipo-pokemon.dto';

@Injectable()
export class EquipoService {
  constructor(
    @InjectRepository(Equipo)
    private equipoRepository: Repository<Equipo>,
    @InjectRepository(EquipoPokemon)
    private equipoPokemonRepository: Repository<EquipoPokemon>,
    @InjectRepository(EquipoPokemonMovimiento)
    private equipoPokemonMovimientoRepository: Repository<EquipoPokemonMovimiento>,
    @InjectRepository(PokemonMovimiento)
    private pokemonMovimientoRepository: Repository<PokemonMovimiento>,
    @InjectRepository(PokemonHabilidad)
    private pokemonHabilidadRepository: Repository<PokemonHabilidad>,
  ) {}

  async create(
    createEquipoDto: CreateEquipoDto,
    userId: string,
  ): Promise<Equipo> {
    const equipo = this.equipoRepository.create({
      ...createEquipoDto,
      user_id: userId,
    });
    return await this.equipoRepository.save(equipo);
  }

  async findAll(userId: string): Promise<Equipo[]> {
    return await this.equipoRepository.find({
      where: { user_id: userId },
      relations: [
        'equipoPokemons',
        'equipoPokemons.pokemon',
        'equipoPokemons.item',
        'equipoPokemons.habilidad',
        'equipoPokemons.naturaleza',
      ],
    });
  }

  async findOne(id: string, userId: string): Promise<Equipo> {
    const equipo = await this.equipoRepository.findOne({
      where: { id, user_id: userId },
      relations: [
        'equipoPokemons',
        'equipoPokemons.pokemon',
        'equipoPokemons.pokemon.type1',
        'equipoPokemons.pokemon.type2',
        'equipoPokemons.item',
        'equipoPokemons.habilidad',
        'equipoPokemons.naturaleza',
        'equipoPokemons.equipoPokemonMovimientos',
        'equipoPokemons.equipoPokemonMovimientos.movimiento',
      ],
    });

    if (!equipo) {
      throw new NotFoundException(`Equipo with ID ${id} not found`);
    }

    return equipo;
  }

  async update(
    id: string,
    updateEquipoDto: UpdateEquipoDto,
    userId: string,
  ): Promise<Equipo> {
    const equipo = await this.equipoRepository.findOne({
      where: { id, user_id: userId },
    });
    if (!equipo) {
      throw new NotFoundException(`Equipo with ID ${id} not found`);
    }

    Object.assign(equipo, updateEquipoDto);
    await this.equipoRepository.save(equipo);
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const equipo = await this.equipoRepository.findOne({
      where: { id, user_id: userId },
    });
    if (!equipo) {
      throw new NotFoundException(`Equipo with ID ${id} not found`);
    }
    await this.equipoRepository.remove(equipo);
  }

  async addPokemon(
    equipoId: string,
    createEquipoPokemonDto: CreateEquipoPokemonDto,
    userId: string,
  ): Promise<EquipoPokemon> {
    const equipo = await this.equipoRepository.findOne({
      where: { id: equipoId, user_id: userId },
      relations: ['equipoPokemons'],
    });

    if (!equipo) {
      throw new NotFoundException(`Equipo with ID ${equipoId} not found`);
    }

    // Validar que no exceda 6 Pokémon
    if (equipo.equipoPokemons.length >= 6) {
      throw new BadRequestException(
        'Un equipo no puede tener más de 6 Pokémon',
      );
    }

    // Validar EVs totales (máximo 508)
    const totalEVs =
      (createEquipoPokemonDto.ev_hp || 0) +
      (createEquipoPokemonDto.ev_atk || 0) +
      (createEquipoPokemonDto.ev_def || 0) +
      (createEquipoPokemonDto.ev_spa || 0) +
      (createEquipoPokemonDto.ev_spd || 0) +
      (createEquipoPokemonDto.ev_spe || 0);

    if (totalEVs > 508) {
      throw new BadRequestException('Los EVs totales no pueden exceder 508');
    }

    // Validaciones de movimientos
    this.validateMaxMovimientos(createEquipoPokemonDto.movimiento_ids);
    this.validateNoDuplicateMovimientos(createEquipoPokemonDto.movimiento_ids);
    await this.validatePokemonMovimientos(
      createEquipoPokemonDto.pokemon_id,
      createEquipoPokemonDto.movimiento_ids,
    );

    // Validación de habilidad
    await this.validatePokemonHabilidad(
      createEquipoPokemonDto.pokemon_id,
      createEquipoPokemonDto.habilidad_id,
    );

    const equipoPokemon = this.equipoPokemonRepository.create({
      ...createEquipoPokemonDto,
      equipo_id: equipoId,
    });

    const savedEquipoPokemon =
      await this.equipoPokemonRepository.save(equipoPokemon);

    // Agregar movimientos
    for (const movimientoId of createEquipoPokemonDto.movimiento_ids) {
      const equipoPokemonMovimiento =
        this.equipoPokemonMovimientoRepository.create({
          equipo_pokemon_id: savedEquipoPokemon.id,
          movimiento_id: movimientoId,
        });
      await this.equipoPokemonMovimientoRepository.save(
        equipoPokemonMovimiento,
      );
    }

    return this.findEquipoPokemon(savedEquipoPokemon.id, userId);
  }

  async updatePokemon(
    equipoPokemonId: string,
    updateEquipoPokemonDto: UpdateEquipoPokemonDto,
    userId: string,
  ): Promise<EquipoPokemon> {
    const equipoPokemon = await this.equipoPokemonRepository.findOne({
      where: { id: equipoPokemonId },
      relations: ['equipo'],
    });

    if (!equipoPokemon || equipoPokemon.equipo.user_id !== userId) {
      throw new NotFoundException(
        `EquipoPokemon with ID ${equipoPokemonId} not found`,
      );
    }

    // Validar EVs si se están actualizando
    if (
      updateEquipoPokemonDto.ev_hp !== undefined ||
      updateEquipoPokemonDto.ev_atk !== undefined ||
      updateEquipoPokemonDto.ev_def !== undefined ||
      updateEquipoPokemonDto.ev_spa !== undefined ||
      updateEquipoPokemonDto.ev_spd !== undefined ||
      updateEquipoPokemonDto.ev_spe !== undefined
    ) {
      const newEvs = {
        ev_hp: updateEquipoPokemonDto.ev_hp ?? equipoPokemon.ev_hp,
        ev_atk: updateEquipoPokemonDto.ev_atk ?? equipoPokemon.ev_atk,
        ev_def: updateEquipoPokemonDto.ev_def ?? equipoPokemon.ev_def,
        ev_spa: updateEquipoPokemonDto.ev_spa ?? equipoPokemon.ev_spa,
        ev_spd: updateEquipoPokemonDto.ev_spd ?? equipoPokemon.ev_spd,
        ev_spe: updateEquipoPokemonDto.ev_spe ?? equipoPokemon.ev_spe,
      };

      const totalEVs = Object.values(newEvs).reduce((sum, ev) => sum + ev, 0);
      if (totalEVs > 508) {
        throw new BadRequestException('Los EVs totales no pueden exceder 508');
      }
    }

    // Validar habilidad si se está actualizando
    if (updateEquipoPokemonDto.habilidad_id) {
      await this.validatePokemonHabilidad(
        equipoPokemon.pokemon_id,
        updateEquipoPokemonDto.habilidad_id,
      );
    }

    // Actualizar movimientos si se proporcionan
    if (updateEquipoPokemonDto.movimiento_ids) {
      // Validaciones de movimientos
      this.validateMaxMovimientos(updateEquipoPokemonDto.movimiento_ids);
      this.validateNoDuplicateMovimientos(
        updateEquipoPokemonDto.movimiento_ids,
      );
      await this.validatePokemonMovimientos(
        equipoPokemon.pokemon_id,
        updateEquipoPokemonDto.movimiento_ids,
      );

      // Eliminar movimientos existentes
      await this.equipoPokemonMovimientoRepository.delete({
        equipo_pokemon_id: equipoPokemonId,
      });

      // Agregar nuevos movimientos
      for (const movimientoId of updateEquipoPokemonDto.movimiento_ids) {
        const equipoPokemonMovimiento =
          this.equipoPokemonMovimientoRepository.create({
            equipo_pokemon_id: equipoPokemonId,
            movimiento_id: movimientoId,
          });
        await this.equipoPokemonMovimientoRepository.save(
          equipoPokemonMovimiento,
        );
      }
    }

    Object.assign(equipoPokemon, updateEquipoPokemonDto);
    await this.equipoPokemonRepository.save(equipoPokemon);
    return this.findEquipoPokemon(equipoPokemonId, userId);
  }

  async removePokemon(equipoPokemonId: string, userId: string): Promise<void> {
    const equipoPokemon = await this.equipoPokemonRepository.findOne({
      where: { id: equipoPokemonId },
      relations: ['equipo'],
    });

    if (!equipoPokemon || equipoPokemon.equipo.user_id !== userId) {
      throw new NotFoundException(
        `EquipoPokemon with ID ${equipoPokemonId} not found`,
      );
    }

    await this.equipoPokemonRepository.remove(equipoPokemon);
  }

  private async findEquipoPokemon(
    id: string,
    userId: string,
  ): Promise<EquipoPokemon> {
    const equipoPokemon = await this.equipoPokemonRepository.findOne({
      where: { id },
      relations: [
        'equipo',
        'pokemon',
        'pokemon.type1',
        'pokemon.type2',
        'item',
        'habilidad',
        'naturaleza',
        'equipoPokemonMovimientos',
        'equipoPokemonMovimientos.movimiento',
      ],
    });

    if (!equipoPokemon || equipoPokemon.equipo.user_id !== userId) {
      throw new NotFoundException(`EquipoPokemon with ID ${id} not found`);
    }

    return equipoPokemon;
  }

  /**
   * Valida que los movimientos proporcionados estén en la lista de movimientos permitidos del Pokémon
   */
  private async validatePokemonMovimientos(
    pokemonId: string,
    movimientoIds: string[],
  ): Promise<void> {
    if (movimientoIds.length === 0) return;

    const allowedMovimientos = await this.pokemonMovimientoRepository.find({
      where: { pokemon_id: pokemonId },
    });

    const allowedMovimientoIds = allowedMovimientos.map(
      (pm) => pm.movimiento_id,
    );

    const invalidMovimientos = movimientoIds.filter(
      (movId) => !allowedMovimientoIds.includes(movId),
    );

    if (invalidMovimientos.length > 0) {
      throw new BadRequestException(
        `Los siguientes movimientos no están permitidos para este Pokémon: ${invalidMovimientos.join(', ')}`,
      );
    }
  }

  /**
   * Valida que la habilidad proporcionada esté en la lista de habilidades permitidas del Pokémon
   */
  private async validatePokemonHabilidad(
    pokemonId: string,
    habilidadId: string,
  ): Promise<void> {
    const allowedHabilidades = await this.pokemonHabilidadRepository.find({
      where: { pokemon_id: pokemonId },
    });

    const allowedHabilidadIds = allowedHabilidades.map((ph) => ph.habilidad_id);

    if (!allowedHabilidadIds.includes(habilidadId)) {
      throw new BadRequestException(
        'La habilidad seleccionada no está permitida para este Pokémon',
      );
    }
  }

  /**
   * Valida que no haya movimientos duplicados
   */
  private validateNoDuplicateMovimientos(movimientoIds: string[]): void {
    const uniqueMovimientos = new Set(movimientoIds);
    if (uniqueMovimientos.size !== movimientoIds.length) {
      throw new BadRequestException(
        'No se pueden asignar movimientos duplicados al mismo Pokémon',
      );
    }
  }

  /**
   * Valida que no se excedan los 4 movimientos máximos
   */
  private validateMaxMovimientos(movimientoIds: string[]): void {
    if (movimientoIds.length > 4) {
      throw new BadRequestException(
        'Un Pokémon no puede tener más de 4 movimientos',
      );
    }
  }
}
