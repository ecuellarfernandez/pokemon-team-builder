import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Tipo } from '../entities/tipo.entity';
import { CreateTipoDto } from '../dto/tipo/create-tipo.dto';
import { UpdateTipoDto } from 'src/dto/tipo/update-tipo.dto';

@Injectable()
export class TipoService {
  constructor(
    @InjectRepository(Tipo)
    private tipoRepository: Repository<Tipo>,
  ) {}

  async create(createTipoDto: CreateTipoDto): Promise<Tipo> {
    const tipo = this.tipoRepository.create(createTipoDto);
    return await this.tipoRepository.save(tipo);
  }

  async findAll(name?: string): Promise<Tipo[]> {
    if (name) {
      return await this.tipoRepository.find({
        where: { name: Like(`%${name}%`) },
        order: { name: 'ASC' },
      });
    }
    return await this.tipoRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findByName(name: string): Promise<Tipo[]> {
    return await this.tipoRepository.find({
      where: { name: Like(`%${name}%`) },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Tipo> {
    const tipo = await this.tipoRepository.findOne({
      where: { id },
    });
    if (!tipo) {
      throw new NotFoundException(`Tipo with ID ${id} not found`);
    }
    return tipo;
  }

  async update(id: string, updateTipoDto: UpdateTipoDto): Promise<Tipo> {
    const tipo = await this.findOne(id);
    Object.assign(tipo, updateTipoDto);
    return await this.tipoRepository.save(tipo);
  }

  async remove(id: string): Promise<void> {
    const tipo = await this.findOne(id);
    await this.tipoRepository.remove(tipo);
  }
}
