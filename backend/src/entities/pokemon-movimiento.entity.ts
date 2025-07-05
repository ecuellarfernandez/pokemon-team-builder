import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pokemon } from './pokemon.entity';
import { Movimiento } from './movimiento.entity';

@Entity('pokemon_movimientos')
export class PokemonMovimiento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pokemon_id: string;

  @Column()
  movimiento_id: string;

  @ManyToOne(() => Pokemon, (pokemon) => pokemon.pokemonMovimientos)
  @JoinColumn({ name: 'pokemon_id' })
  pokemon: Pokemon;

  @ManyToOne(() => Movimiento, (movimiento) => movimiento.pokemonMovimientos)
  @JoinColumn({ name: 'movimiento_id' })
  movimiento: Movimiento;
}
