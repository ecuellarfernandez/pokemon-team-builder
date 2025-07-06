import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, Role } from '../entities';
import { RegisterDto } from '../dto/auth/register.dto';
import { LoginDto } from '../dto/auth/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Obtener el rol de usuario por defecto
    const userRole = await this.roleRepository.findOne({
      where: { name: 'user' },
    });

    if (!userRole) {
      throw new BadRequestException('User role not found');
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Crear el usuario
    const usuario = this.usuarioRepository.create({
      username,
      email,
      password_hash,
      role_id: userRole.id,
    });

    await this.usuarioRepository.save(usuario);

    // Generar JWT
    const payload = {
      sub: usuario.id,
      username: usuario.username,
      role: userRole.name,
    };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Buscar usuario con su rol
    const usuario = await this.usuarioRepository.findOne({
      where: { username },
      relations: ['role'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      password,
      usuario.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generar JWT
    const payload = {
      sub: usuario.id,
      username: usuario.username,
      role: usuario.role.name,
    };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }

  async validateUser(userId: string) {
    console.log('AuthService - Validating user with ID:', userId);
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { id: userId },
        relations: ['role'],
      });

      if (!usuario) {
        console.log('AuthService - User not found in database for ID:', userId);
        return null;
      }

      console.log(
        'AuthService - User found:',
        usuario.username,
        'with role:',
        usuario.role?.name,
      );
      return {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
        role: usuario.role.name,
      };
    } catch (error) {
      console.error('AuthService - Error validating user:', error);
      return null;
    }
  }
}
