import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Tipo } from './tipo.entity';
import { PokemonHabilidad } from './pokemon-habilidad.entity';
import { PokemonMovimiento } from './pokemon-movimiento.entity';
import { EquipoPokemon } from './equipo-pokemon.entity';

@Entity('pokemons')
export class Pokemon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type_1_id: string;

  @Column({ nullable: true })
  type_2_id: string;

  @Column()
  base_hp: number;

  @Column()
  base_atk: number;

  @Column()
  base_def: number;

  @Column()
  base_spa: number;

  @Column()
  base_spd: number;

  @Column()
  base_spe: number;

  @Column()
  image_url: string;

  @ManyToOne(() => Tipo, (tipo) => tipo.pokemonType1)
  @JoinColumn({ name: 'type_1_id' })
  type1: Tipo;

  @ManyToOne(() => Tipo, (tipo) => tipo.pokemonType2)
  @JoinColumn({ name: 'type_2_id' })
  type2: Tipo;

  @OneToMany(
    () => PokemonHabilidad,
    (pokemonHabilidad) => pokemonHabilidad.pokemon,
  )
  pokemonHabilidades: PokemonHabilidad[];

  @OneToMany(
    () => PokemonMovimiento,
    (pokemonMovimiento) => pokemonMovimiento.pokemon,
  )
  pokemonMovimientos: PokemonMovimiento[];

  @OneToMany(() => EquipoPokemon, (equipoPokemon) => equipoPokemon.pokemon)
  equipoPokemons: EquipoPokemon[];
}
