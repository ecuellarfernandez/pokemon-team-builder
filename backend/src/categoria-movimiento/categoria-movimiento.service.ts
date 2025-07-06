import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CategoriaMovimiento } from '../entities/categoria-movimiento.entity';
import { CreateCategoriaMovimientoDto } from '../dto/categoria-movimiento/create-categoria-movimiento.dto';
import { UpdateCategoriaMovimientoDto } from 'src/dto/categoria-movimiento/update-categoria-movimiento.dto';

@Injectable()
export class CategoriaMovimientoService {
  constructor(
    @InjectRepository(CategoriaMovimiento)
    private categoriaMovimientoRepository: Repository<CategoriaMovimiento>,
  ) {}

  async create(
    createCategoriaMovimientoDto: CreateCategoriaMovimientoDto,
  ): Promise<CategoriaMovimiento> {
    const categoriaMovimiento = this.categoriaMovimientoRepository.create(
      createCategoriaMovimientoDto,
    );
    return await this.categoriaMovimientoRepository.save(categoriaMovimiento);
  }

  async findAll(name?: string): Promise<CategoriaMovimiento[]> {
    if (name) {
      return await this.categoriaMovimientoRepository.find({
        where: { name: Like(`%${name}%`) },
        order: { name: 'ASC' },
      });
    }
    return await this.categoriaMovimientoRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findByName(name: string): Promise<CategoriaMovimiento[]> {
    return await this.categoriaMovimientoRepository.find({
      where: { name: Like(`%${name}%`) },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CategoriaMovimiento> {
    const categoriaMovimiento =
      await this.categoriaMovimientoRepository.findOne({
        where: { id },
      });
    if (!categoriaMovimiento) {
      throw new NotFoundException(
        `CategoriaMovimiento with ID ${id} not found`,
      );
    }
    return categoriaMovimiento;
  }

  async update(
    id: string,
    updateCategoriaMovimientoDto: UpdateCategoriaMovimientoDto,
  ): Promise<CategoriaMovimiento> {
    const categoriaMovimiento = await this.findOne(id);
    Object.assign(categoriaMovimiento, updateCategoriaMovimientoDto);
    return await this.categoriaMovimientoRepository.save(categoriaMovimiento);
  }

  async remove(id: string): Promise<void> {
    const categoriaMovimiento = await this.findOne(id);
    await this.categoriaMovimientoRepository.remove(categoriaMovimiento);
  }
}
