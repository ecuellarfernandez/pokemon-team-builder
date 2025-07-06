import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Item } from '../entities';
import { CreateItemDto } from '../dto/item/create-item.dto';
import { UpdateItemDto } from '../dto/item/update-item.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const item = this.itemRepository.create(createItemDto);
    return await this.itemRepository.save(item);
  }

  async findAll(name?: string): Promise<Item[]> {
    const whereCondition = name ? { name: ILike(`%${name}%`) } : {};
    return await this.itemRepository.find({
      where: whereCondition,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item;
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.findOne(id);
    Object.assign(item, updateItemDto);
    return await this.itemRepository.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.itemRepository.remove(item);
  }

  async findByName(name: string): Promise<Item[]> {
    return await this.itemRepository.find({
      where: { name: ILike(`%${name}%`) },
      take: 10, // Límite para autocompletado
    });
  }
}
