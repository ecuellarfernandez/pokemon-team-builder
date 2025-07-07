import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Pokemon, PokemonHabilidad, PokemonMovimiento } from '../entities';
import { CreatePokemonDto } from '../dto/pokemon/create-pokemon.dto';
import { UpdatePokemonDto } from '../dto/pokemon/update-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
    @InjectRepository(PokemonHabilidad)
    private pokemonHabilidadRepository: Repository<PokemonHabilidad>,
    @InjectRepository(PokemonMovimiento)
    private pokemonMovimientoRepository: Repository<PokemonMovimiento>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    const { habilidad_ids, movimiento_ids, ...pokemonData } = createPokemonDto;

    // Crear el Pokémon
    const pokemon = this.pokemonRepository.create(pokemonData);
    const savedPokemon = await this.pokemonRepository.save(pokemon);

    // Crear relaciones con habilidades
    if (habilidad_ids && habilidad_ids.length > 0) {
      const pokemonHabilidades = habilidad_ids.map((habilidadId) =>
        this.pokemonHabilidadRepository.create({
          pokemon_id: savedPokemon.id,
          habilidad_id: habilidadId,
        }),
      );
      await this.pokemonHabilidadRepository.save(pokemonHabilidades);
    }

    // Crear relaciones con movimientos
    if (movimiento_ids && movimiento_ids.length > 0) {
      const pokemonMovimientos = movimiento_ids.map((movimientoId) =>
        this.pokemonMovimientoRepository.create({
          pokemon_id: savedPokemon.id,
          movimiento_id: movimientoId,
        }),
      );
      await this.pokemonMovimientoRepository.save(pokemonMovimientos);
    }

    return await this.findOne(savedPokemon.id);
  }

  async findAll(name?: string): Promise<any[]> {
    const whereCondition = name ? { name: ILike(`%${name}%`) } : {};
    const pokemons = await this.pokemonRepository.find({
      where: whereCondition,
      relations: ['type1', 'type2'],
      order: { name: 'ASC' },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return pokemons.map(({ type_1_id, type_2_id, type1, type2, ...rest }) => ({
      ...rest,
      type1: type1 ? { id: type1.id, name: type1.name } : null,
      type2: type2 ? { id: type2.id, name: type2.name } : null,
    }));
  }

  async findOne(id: string): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
      relations: [
        'type1',
        'type2',
        'pokemonHabilidades',
        'pokemonHabilidades.habilidad',
        'pokemonMovimientos',
        'pokemonMovimientos.movimiento',
      ],
    });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with ID ${id} not found`);
    }

    return pokemon;
  }

  async update(
    id: string,
    updatePokemonDto: UpdatePokemonDto,
  ): Promise<Pokemon> {
    const { habilidad_ids, movimiento_ids, ...pokemonData } = updatePokemonDto;

    // Actualizar datos básicos del Pokémon
    if (Object.keys(pokemonData).length > 0) {
      await this.pokemonRepository.update(id, pokemonData);
    }

    // Actualizar habilidades si se proporcionan
    if (habilidad_ids !== undefined) {
      // Eliminar habilidades existentes
      await this.pokemonHabilidadRepository.delete({ pokemon_id: id });

      // Crear nuevas relaciones con habilidades
      if (habilidad_ids.length > 0) {
        const pokemonHabilidades = habilidad_ids.map((habilidadId) =>
          this.pokemonHabilidadRepository.create({
            pokemon_id: id,
            habilidad_id: habilidadId,
          }),
        );
        await this.pokemonHabilidadRepository.save(pokemonHabilidades);
      }
    }

    // Actualizar movimientos si se proporcionan
    if (movimiento_ids !== undefined) {
      // Eliminar movimientos existentes
      await this.pokemonMovimientoRepository.delete({ pokemon_id: id });

      // Crear nuevas relaciones con movimientos
      if (movimiento_ids.length > 0) {
        const pokemonMovimientos = movimiento_ids.map((movimientoId) =>
          this.pokemonMovimientoRepository.create({
            pokemon_id: id,
            movimiento_id: movimientoId,
          }),
        );
        await this.pokemonMovimientoRepository.save(pokemonMovimientos);
      }
    }

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const pokemon = await this.findOne(id);

    // Eliminar relaciones con habilidades
    await this.pokemonHabilidadRepository.delete({ pokemon_id: id });

    // Eliminar relaciones con movimientos
    await this.pokemonMovimientoRepository.delete({ pokemon_id: id });

    // Ahora eliminar el Pokémon
    await this.pokemonRepository.remove(pokemon);
  }

  async getPokemonHabilidades(pokemonId: string): Promise<any[]> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id: pokemonId },
      relations: ['pokemonHabilidades', 'pokemonHabilidades.habilidad'],
    });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with ID ${pokemonId} not found`);
    }

    return pokemon.pokemonHabilidades.map((ph) => ({
      id: ph.habilidad.id,
      name: ph.habilidad.name,
    }));
  }

  async getPokemonMovimientos(pokemonId: string): Promise<any[]> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id: pokemonId },
      relations: [
        'pokemonMovimientos',
        'pokemonMovimientos.movimiento',
        'pokemonMovimientos.movimiento.categoria',
        'pokemonMovimientos.movimiento.tipo',
      ],
    });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with ID ${pokemonId} not found`);
    }

    return pokemon.pokemonMovimientos.map((pm) => ({
      id: pm.movimiento.id,
      name: pm.movimiento.name,
      description: pm.movimiento.description,
      power: pm.movimiento.power,
      accuracy: pm.movimiento.accuracy,
      categoria: pm.movimiento.categoria
        ? {
            id: pm.movimiento.categoria.id,
            name: pm.movimiento.categoria.name,
          }
        : null,
      tipo: pm.movimiento.tipo
        ? {
            id: pm.movimiento.tipo.id,
            name: pm.movimiento.tipo.name,
          }
        : null,
    }));
  }

  async findByName(name: string): Promise<any[]> {
    const pokemons = await this.pokemonRepository.find({
      where: { name: ILike(`%${name}%`) },
      relations: ['type1', 'type2'],
      take: 10, // Límite para autocompletado
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return pokemons.map(({ type_1_id, type_2_id, type1, type2, ...rest }) => ({
      ...rest,
      type1: type1 ? { id: type1.id, name: type1.name } : null,
      type2: type2 ? { id: type2.id, name: type2.name } : null,
    }));
  }
}
