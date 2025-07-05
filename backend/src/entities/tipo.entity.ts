import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pokemon } from './pokemon.entity';
import { Movimiento } from './movimiento.entity';

@Entity('tipos')
export class Tipo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // 'Fire', 'Water', 'Steel', etc.

  @OneToMany(() => Pokemon, (pokemon) => pokemon.type1)
  pokemonType1: Pokemon[];

  @OneToMany(() => Pokemon, (pokemon) => pokemon.type2)
  pokemonType2: Pokemon[];

  @OneToMany(() => Movimiento, (movimiento) => movimiento.tipo)
  movimientos: Movimiento[];
}
