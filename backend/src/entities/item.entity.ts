import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EquipoPokemon } from './equipo-pokemon.entity';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image_url: string;

  @OneToMany(() => EquipoPokemon, (equipoPokemon) => equipoPokemon.item)
  equipoPokemons: EquipoPokemon[];
}
