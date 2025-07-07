import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EquipoPokemon } from './equipo-pokemon.entity';

@Entity('naturalezas')
export class Naturaleza {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  stat_aumentada: string;

  @Column({ nullable: true })
  stat_disminuida: string;

  @OneToMany(() => EquipoPokemon, (equipoPokemon) => equipoPokemon.naturaleza)
  equipoPokemons: EquipoPokemon[];
}
