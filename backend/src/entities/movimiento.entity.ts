import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Tipo } from './tipo.entity';
import { CategoriaMovimiento } from './categoria-movimiento.entity';
import { PokemonMovimiento } from './pokemon-movimiento.entity';
import { EquipoPokemonMovimiento } from './equipo-pokemon-movimiento.entity';

@Entity('movimientos')
export class Movimiento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type_id: string;

  @Column()
  categoria_id: string;

  @Column({ nullable: true })
  power: number;

  @Column()
  accuracy: number;

  @Column()
  description: string;

  @ManyToOne(() => Tipo, (tipo) => tipo.movimientos)
  @JoinColumn({ name: 'type_id' })
  tipo: Tipo;

  @ManyToOne(() => CategoriaMovimiento, (categoria) => categoria.movimientos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaMovimiento;

  @OneToMany(
    () => PokemonMovimiento,
    (pokemonMovimiento) => pokemonMovimiento.movimiento,
  )
  pokemonMovimientos: PokemonMovimiento[];

  @OneToMany(
    () => EquipoPokemonMovimiento,
    (equipoPokemonMovimiento) => equipoPokemonMovimiento.movimiento,
  )
  equipoPokemonMovimientos: EquipoPokemonMovimiento[];
}
