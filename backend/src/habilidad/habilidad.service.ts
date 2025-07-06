import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Habilidad } from '../entities/habilidad.entity';
import { CreateHabilidadDto } from '../dto/habilidad/create-habilidad.dto';
import { UpdateHabilidadDto } from 'src/dto/habilidad/update-habilidad.dto';

@Injectable()
export class HabilidadService {
  constructor(
    @InjectRepository(Habilidad)
    private habilidadRepository: Repository<Habilidad>,
  ) {}

  async create(createHabilidadDto: CreateHabilidadDto): Promise<Habilidad> {
    const habilidad = this.habilidadRepository.create(createHabilidadDto);
    return await this.habilidadRepository.save(habilidad);
  }

  async findAll(name?: string): Promise<Habilidad[]> {
    if (name) {
      return await this.habilidadRepository.find({
        where: { name: Like(`%${name}%`) },
        order: { name: 'ASC' },
      });
    }
    return await this.habilidadRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findByName(name: string): Promise<Habilidad[]> {
    return await this.habilidadRepository.find({
      where: { name: Like(`%${name}%`) },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Habilidad> {
    const habilidad = await this.habilidadRepository.findOne({
      where: { id },
    });
    if (!habilidad) {
      throw new NotFoundException(`Habilidad with ID ${id} not found`);
    }
    return habilidad;
  }

  async update(
    id: string,
    updateHabilidadDto: UpdateHabilidadDto,
  ): Promise<Habilidad> {
    const habilidad = await this.findOne(id);
    Object.assign(habilidad, updateHabilidadDto);
    return await this.habilidadRepository.save(habilidad);
  }

  async remove(id: string): Promise<void> {
    const habilidad = await this.findOne(id);
    await this.habilidadRepository.remove(habilidad);
  }
}
