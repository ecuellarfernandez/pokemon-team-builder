import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // 'admin' | 'user'

  @OneToMany(() => Usuario, (usuario) => usuario.role)
  usuarios: Usuario[];
}
