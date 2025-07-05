import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { EquipoPokemon } from './equipo-pokemon.entity';

@Entity('equipos')
export class Equipo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  user_id: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.equipos)
  @JoinColumn({ name: 'user_id' })
  usuario: Usuario;

  @OneToMany(() => EquipoPokemon, (equipoPokemon) => equipoPokemon.equipo)
  equipoPokemons: EquipoPokemon[];
}
