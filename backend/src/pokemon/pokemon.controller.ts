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
import { HabilidadService } from '../habilidad/habilidad.service';
import { MovimientoService } from '../movimiento/movimiento.service';
import { TransformArraysInterceptor } from '../common/interceptors/transform-arrays.interceptor';

@Controller('pokemon')
@UseGuards(JwtAuthGuard)
export class PokemonController {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly uploadService: UploadService,
    private readonly habilidadService: HabilidadService,
    private readonly movimientoService: MovimientoService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'), TransformArraysInterceptor)
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

  @Get('admin/habilidades')
  @UseGuards(RolesGuard)
  @Roles('admin')
  getAllHabilidades(@Query('name') name?: string) {
    return this.habilidadService.findAll(name);
  }

  @Get('admin/movimientos')
  @UseGuards(RolesGuard)
  @Roles('admin')
  getAllMovimientos(@Query('name') name?: string) {
    return this.movimientoService.findAll(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(id);
  }

  @Get(':id/habilidades')
  getPokemonHabilidades(@Param('id') id: string) {
    return this.pokemonService.getPokemonHabilidades(id);
  }

  @Get(':id/movimientos')
  getPokemonMovimientos(@Param('id') id: string) {
    return this.pokemonService.getPokemonMovimientos(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'), TransformArraysInterceptor)
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
