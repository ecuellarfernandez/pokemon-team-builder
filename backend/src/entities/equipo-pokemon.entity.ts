import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Equipo } from './equipo.entity';
import { Pokemon } from './pokemon.entity';
import { Item } from './item.entity';
import { Habilidad } from './habilidad.entity';
import { Naturaleza } from './naturaleza.entity';
import { EquipoPokemonMovimiento } from './equipo-pokemon-movimiento.entity';

@Entity('equipo_pokemons')
export class EquipoPokemon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  equipo_id: string;

  @Column()
  pokemon_id: string;

  @Column()
  item_id: string;

  @Column()
  habilidad_id: string;

  @Column()
  nature_id: string;

  @Column()
  nickname: string;

  @Column({ default: 0 })
  ev_hp: number;

  @Column({ default: 0 })
  ev_atk: number;

  @Column({ default: 0 })
  ev_def: number;

  @Column({ default: 0 })
  ev_spa: number;

  @Column({ default: 0 })
  ev_spd: number;

  @Column({ default: 0 })
  ev_spe: number;

  @Column({ default: 31 })
  iv_hp: number;

  @Column({ default: 31 })
  iv_atk: number;

  @Column({ default: 31 })
  iv_def: number;

  @Column({ default: 31 })
  iv_spa: number;

  @Column({ default: 31 })
  iv_spd: number;

  @Column({ default: 31 })
  iv_spe: number;

  @Column({ default: 100 })
  nivel: number;

  @ManyToOne(() => Equipo, (equipo) => equipo.equipoPokemons)
  @JoinColumn({ name: 'equipo_id' })
  equipo: Equipo;

  @ManyToOne(() => Pokemon, (pokemon) => pokemon.equipoPokemons)
  @JoinColumn({ name: 'pokemon_id' })
  pokemon: Pokemon;

  @ManyToOne(() => Item, (item) => item.equipoPokemons)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @ManyToOne(() => Habilidad, (habilidad) => habilidad.equipoPokemons)
  @JoinColumn({ name: 'habilidad_id' })
  habilidad: Habilidad;

  @ManyToOne(() => Naturaleza, (naturaleza) => naturaleza.equipoPokemons)
  @JoinColumn({ name: 'nature_id' })
  naturaleza: Naturaleza;

  @OneToMany(
    () => EquipoPokemonMovimiento,
    (equipoPokemonMovimiento) => equipoPokemonMovimiento.equipoPokemon,
  )
  equipoPokemonMovimientos: EquipoPokemonMovimiento[];
}
