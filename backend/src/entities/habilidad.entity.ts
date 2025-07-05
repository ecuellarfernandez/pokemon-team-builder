import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PokemonHabilidad } from './pokemon-habilidad.entity';
import { EquipoPokemon } from './equipo-pokemon.entity';

@Entity('habilidades')
export class Habilidad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(
    () => PokemonHabilidad,
    (pokemonHabilidad) => pokemonHabilidad.habilidad,
  )
  pokemonHabilidades: PokemonHabilidad[];

  @OneToMany(() => EquipoPokemon, (equipoPokemon) => equipoPokemon.habilidad)
  equipoPokemons: EquipoPokemon[];
}
