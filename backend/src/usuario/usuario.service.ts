import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, Role } from '../entities';
import { CreateUsuarioDto } from '../dto/usuario/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/usuario/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { username, email, password, role_id } = createUsuarioDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Verificar que el rol existe
    const role = await this.roleRepository.findOne({ where: { id: role_id } });
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const usuario = this.usuarioRepository.create({
      username,
      email,
      password_hash,
      role_id,
    });

    return await this.usuarioRepository.save(usuario);
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      relations: ['role'],
      select: ['id', 'username', 'email', 'role_id'], // Excluir password_hash
    });
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['role'],
      select: ['id', 'username', 'email', 'role_id'], // Excluir password_hash
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario with ID ${id} not found`);
    }

    return usuario;
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario with ID ${id} not found`);
    }

    // Si se actualiza la contraseña, hashearla
    if (updateUsuarioDto.password) {
      const saltRounds = 10;
      updateUsuarioDto.password = await bcrypt.hash(
        updateUsuarioDto.password,
        saltRounds,
      );
    }

    // Si se actualiza el rol, verificar que existe
    if (updateUsuarioDto.role_id) {
      const role = await this.roleRepository.findOne({
        where: { id: updateUsuarioDto.role_id },
      });
      if (!role) {
        throw new BadRequestException('Role not found');
      }
    }

    Object.assign(usuario, updateUsuarioDto);
    if (updateUsuarioDto.password) {
      usuario.password_hash = updateUsuarioDto.password;
    }

    await this.usuarioRepository.save(usuario);
    return this.findOne(id); // Retornar sin password_hash
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario with ID ${id} not found`);
    }
    await this.usuarioRepository.remove(usuario);
  }
}
