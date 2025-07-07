import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
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

  async findAll(name?: string): Promise<any[]> {
    const whereCondition = name ? { name: ILike(`%${name}%`) } : {};
    const movimientos = await this.movimientoRepository.find({
      where: whereCondition,
      relations: ['tipo', 'categoria'],
      order: { name: 'ASC' },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return movimientos.map(({ categoria_id, tipo, categoria, ...rest }) => ({
      ...rest,
      type: tipo,
      category: categoria,
    }));
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
    await this.findOne(id);

    await this.movimientoRepository.update(id, updateMovimientoDto);

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const movimiento = await this.findOne(id);
    await this.movimientoRepository.remove(movimiento);
  }

  async findByName(name: string): Promise<any[]> {
    const movimientos = await this.movimientoRepository.find({
      where: { name: ILike(`%${name}%`) },
      relations: ['tipo', 'categoria'],
      take: 10, // Límite para autocompletado
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return movimientos.map(({ categoria_id, tipo, categoria, ...rest }) => ({
      ...rest,
      type: tipo,
      category: categoria,
    }));
  }
}
