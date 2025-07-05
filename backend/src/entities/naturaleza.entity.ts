import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EquipoPokemon } from './equipo-pokemon.entity';

@Entity('naturalezas')
export class Naturaleza {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => EquipoPokemon, (equipoPokemon) => equipoPokemon.naturaleza)
  equipoPokemons: EquipoPokemon[];
}
