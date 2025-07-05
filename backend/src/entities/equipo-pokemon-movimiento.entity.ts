import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EquipoPokemon } from './equipo-pokemon.entity';
import { Movimiento } from './movimiento.entity';

@Entity('equipo_pokemon_movimientos')
export class EquipoPokemonMovimiento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  equipo_pokemon_id: string;

  @Column()
  movimiento_id: string;

  @ManyToOne(
    () => EquipoPokemon,
    (equipoPokemon) => equipoPokemon.equipoPokemonMovimientos,
  )
  @JoinColumn({ name: 'equipo_pokemon_id' })
  equipoPokemon: EquipoPokemon;

  @ManyToOne(
    () => Movimiento,
    (movimiento) => movimiento.equipoPokemonMovimientos,
  )
  @JoinColumn({ name: 'movimiento_id' })
  movimiento: Movimiento;
}
