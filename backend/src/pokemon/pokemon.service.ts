import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Pokemon } from '../entities';
import { CreatePokemonDto } from '../dto/pokemon/create-pokemon.dto';
import { UpdatePokemonDto } from '../dto/pokemon/update-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    const pokemon = this.pokemonRepository.create(createPokemonDto);
    return await this.pokemonRepository.save(pokemon);
  }

  async findAll(name?: string): Promise<Pokemon[]> {
    const whereCondition = name ? { name: Like(`%${name}%`) } : {};
    return await this.pokemonRepository.find({
      where: whereCondition,
      relations: ['type1', 'type2'],
      order: { name: 'ASC' },
    });
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
    const pokemon = await this.findOne(id);
    Object.assign(pokemon, updatePokemonDto);
    return await this.pokemonRepository.save(pokemon);
  }

  async remove(id: string): Promise<void> {
    const pokemon = await this.findOne(id);
    await this.pokemonRepository.remove(pokemon);
  }

  async findByName(name: string): Promise<Pokemon[]> {
    return await this.pokemonRepository.find({
      where: { name: Like(`%${name}%`) },
      relations: ['type1', 'type2'],
      take: 10, // Límite para autocompletado
    });
  }
}
