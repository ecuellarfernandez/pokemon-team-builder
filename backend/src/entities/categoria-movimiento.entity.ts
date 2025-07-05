import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Movimiento } from './movimiento.entity';

@Entity('categoria_movimientos')
export class CategoriaMovimiento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // 'Physical', 'Special', 'Status'

  @OneToMany(() => Movimiento, (movimiento) => movimiento.categoria)
  movimientos: Movimiento[];
}
