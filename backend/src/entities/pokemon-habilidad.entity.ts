import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pokemon } from './pokemon.entity';
import { Habilidad } from './habilidad.entity';

@Entity('pokemon_habilidades')
export class PokemonHabilidad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pokemon_id: string;

  @Column()
  habilidad_id: string;

  @ManyToOne(() => Pokemon, (pokemon) => pokemon.pokemonHabilidades)
  @JoinColumn({ name: 'pokemon_id' })
  pokemon: Pokemon;

  @ManyToOne(() => Habilidad, (habilidad) => habilidad.pokemonHabilidades)
  @JoinColumn({ name: 'habilidad_id' })
  habilidad: Habilidad;
}
