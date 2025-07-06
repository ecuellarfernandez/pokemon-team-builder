import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Naturaleza } from '../entities/naturaleza.entity';
import { CreateNaturalezaDto } from '../dto/naturaleza/create-naturaleza.dto';
import { UpdateNaturalezaDto } from 'src/dto/naturaleza/update-naturaleza.dto';

@Injectable()
export class NaturalezaService {
  constructor(
    @InjectRepository(Naturaleza)
    private naturalezaRepository: Repository<Naturaleza>,
  ) {}

  async create(createNaturalezaDto: CreateNaturalezaDto): Promise<Naturaleza> {
    const naturaleza = this.naturalezaRepository.create(createNaturalezaDto);
    return await this.naturalezaRepository.save(naturaleza);
  }

  async findAll(name?: string): Promise<Naturaleza[]> {
    if (name) {
      return await this.naturalezaRepository.find({
        where: { name: Like(`%${name}%`) },
        order: { name: 'ASC' },
      });
    }
    return await this.naturalezaRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findByName(name: string): Promise<Naturaleza[]> {
    return await this.naturalezaRepository.find({
      where: { name: Like(`%${name}%`) },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Naturaleza> {
    const naturaleza = await this.naturalezaRepository.findOne({
      where: { id },
    });
    if (!naturaleza) {
      throw new NotFoundException(`Naturaleza with ID ${id} not found`);
    }
    return naturaleza;
  }

  async update(
    id: string,
    updateNaturalezaDto: UpdateNaturalezaDto,
  ): Promise<Naturaleza> {
    const naturaleza = await this.findOne(id);
    Object.assign(naturaleza, updateNaturalezaDto);
    return await this.naturalezaRepository.save(naturaleza);
  }

  async remove(id: string): Promise<void> {
    const naturaleza = await this.findOne(id);
    await this.naturalezaRepository.remove(naturaleza);
  }
}
