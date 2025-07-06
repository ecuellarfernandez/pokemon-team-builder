import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from '../dto/pokemon/create-pokemon.dto';
import { UpdatePokemonDto } from '../dto/pokemon/update-pokemon.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UploadService } from '../upload/upload.service';

@Controller('pokemon')
@UseGuards(JwtAuthGuard)
export class PokemonController {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createPokemonDto: CreatePokemonDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ) {
    if (imageFile) {
      return this.uploadService.createPokemonWithImage(
        createPokemonDto,
        imageFile,
      );
    }
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll(@Query('name') name?: string) {
    return this.pokemonService.findAll(name);
  }

  @Get('search')
  search(@Query('name') name: string) {
    return this.pokemonService.findByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ) {
    if (imageFile) {
      return this.uploadService.updatePokemonWithImage(
        id,
        updatePokemonDto,
        imageFile,
      );
    }
    return this.pokemonService.update(id, updatePokemonDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.pokemonService.remove(id);
  }
}
