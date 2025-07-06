import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import { promises as fs } from 'fs';
import { UploadResponseDto } from '../dto/upload/upload-response.dto';
import { Pokemon, Item } from '../entities';
import { UpdatePokemonDto } from '../dto/pokemon/update-pokemon.dto';
import { UpdateItemDto } from '../dto/item/update-item.dto';
import { CreatePokemonDto } from 'src/dto/pokemon/create-pokemon.dto';
import { CreateItemDto } from 'src/dto/item/create-item.dto';

@Injectable()
export class UploadService {
  private readonly uploadsPath: string;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {
    this.uploadsPath = path.join(process.cwd(), 'uploads');
  }

  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.',
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File too large. Maximum size is 5MB.');
    }
  }

  async uploadPokemonImage(
    file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    this.validateFile(file);
    return this.saveFile(file, 'pokemon');
  }

  async uploadItemImage(file: Express.Multer.File): Promise<UploadResponseDto> {
    this.validateFile(file);
    return this.saveFile(file, 'item');
  }

  private async saveFile(
    file: Express.Multer.File,
    category: 'pokemon' | 'item',
  ): Promise<UploadResponseDto> {
    const uploadDir = path.join(process.cwd(), 'uploads', category);

    try {
      await fs.mkdir(uploadDir, { recursive: true });

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = path.extname(file.originalname);
      const filename = `${category}_${timestamp}_${randomString}${fileExtension}`;
      const filePath = path.join(uploadDir, filename);

      await fs.writeFile(filePath, file.buffer);

      const fileUrl = `/uploads/${category}/${filename}`;

      return {
        filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: fileUrl,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to save file: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async deleteFile(type: 'pokemon' | 'item', filename: string): Promise<void> {
    try {
      const filePath = path.join(this.uploadsPath, type, filename);
      await fs.unlink(filePath);
    } catch (error) {
      console.warn(`Could not delete file: ${filename}`, error);
    }
  }

  async createPokemonWithImage(
    createPokemonDto: CreatePokemonDto,
    imageFile?: Express.Multer.File,
  ): Promise<Pokemon> {
    let imageUrl = '';

    if (imageFile) {
      const uploadResult = await this.uploadPokemonImage(imageFile);
      imageUrl = uploadResult.url;
    }

    if (!imageUrl) {
      throw new BadRequestException('Image URL or image file is required');
    }

    const pokemon = this.pokemonRepository.create({
      ...createPokemonDto,
      image_url: imageUrl,
    });

    return await this.pokemonRepository.save(pokemon);
  }

  async updatePokemonWithImage(
    id: string,
    updatePokemonDto: UpdatePokemonDto,
    imageFile?: Express.Multer.File,
  ): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({ where: { id } });
    if (!pokemon) {
      throw new BadRequestException(`Pokemon with ID ${id} not found`);
    }

    let imageUrl = '';

    if (imageFile) {
      // Eliminar imagen anterior si existe
      if (pokemon.image_url && pokemon.image_url.includes('/uploads/')) {
        const filename = path.basename(pokemon.image_url);
        await this.deleteFile('pokemon', filename);
      }

      const uploadResult = await this.uploadPokemonImage(imageFile);
      imageUrl = uploadResult.url;
    }

    Object.assign(pokemon, updatePokemonDto);
    if (imageUrl) {
      pokemon.image_url = imageUrl;
    }

    return await this.pokemonRepository.save(pokemon);
  }

  // Métodos integrados para Item
  async createItemWithImage(
    createItemDto: CreateItemDto,
    imageFile?: Express.Multer.File,
  ): Promise<Item> {
    let imageUrl = '';

    if (imageFile) {
      const uploadResult = await this.uploadItemImage(imageFile);
      imageUrl = uploadResult.url;
    }

    if (!imageUrl) {
      throw new BadRequestException('Image URL or image file is required');
    }

    const item = this.itemRepository.create({
      ...createItemDto,
      image_url: imageUrl,
    });

    return await this.itemRepository.save(item);
  }

  async updateItemWithImage(
    id: string,
    updateItemDto: UpdateItemDto,
    imageFile?: Express.Multer.File,
  ): Promise<Item> {
    const item = await this.itemRepository.findOne({ where: { id } });
    if (!item) {
      throw new BadRequestException(`Item with ID ${id} not found`);
    }

    let imageUrl = '';

    if (imageFile) {
      // Eliminar imagen anterior si existe
      if (item.image_url && item.image_url.includes('/uploads/')) {
        const filename = path.basename(item.image_url);
        await this.deleteFile('item', filename);
      }

      const uploadResult = await this.uploadItemImage(imageFile);
      imageUrl = uploadResult.url;
    }

    Object.assign(item, updateItemDto);
    if (imageUrl) {
      item.image_url = imageUrl;
    }

    return await this.itemRepository.save(item);
  }
}
