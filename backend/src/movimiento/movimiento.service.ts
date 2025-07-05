import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Movimiento } from '../entities';
import { CreateMovimientoDto } from '../dto/movimiento/create-movimiento.dto';
import { UpdateMovimientoDto } from '../dto/movimiento/update-movimiento.dto';

@Injectable()
export class MovimientoService {
  constructor(
    @InjectRepository(Movimiento)
    private movimientoRepository: Repository<Movimiento>,
  ) {}

  async create(createMovimientoDto: CreateMovimientoDto): Promise<Movimiento> {
    const movimiento = this.movimientoRepository.create(createMovimientoDto);
    return await this.movimientoRepository.save(movimiento);
  }

  async findAll(name?: string): Promise<Movimiento[]> {
    const whereCondition = name ? { name: Like(`%${name}%`) } : {};
    return await this.movimientoRepository.find({
      where: whereCondition,
      relations: ['tipo', 'categoria'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Movimiento> {
    const movimiento = await this.movimientoRepository.findOne({
      where: { id },
      relations: ['tipo', 'categoria'],
    });

    if (!movimiento) {
      throw new NotFoundException(`Movimiento with ID ${id} not found`);
    }

    return movimiento;
  }

  async update(
    id: string,
    updateMovimientoDto: UpdateMovimientoDto,
  ): Promise<Movimiento> {
    const movimiento = await this.findOne(id);
    Object.assign(movimiento, updateMovimientoDto);
    return await this.movimientoRepository.save(movimiento);
  }

  async remove(id: string): Promise<void> {
    const movimiento = await this.findOne(id);
    await this.movimientoRepository.remove(movimiento);
  }

  async findByName(name: string): Promise<Movimiento[]> {
    return await this.movimientoRepository.find({
      where: { name: Like(`%${name}%`) },
      relations: ['tipo', 'categoria'],
      take: 10, // Límite para autocompletado
    });
  }
}
