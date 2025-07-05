import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EquipoService } from './equipo.service';
import { CreateEquipoDto } from '../dto/equipo/create-equipo.dto';
import { UpdateEquipoDto } from '../dto/equipo/update-equipo.dto';
import { CreateEquipoPokemonDto } from '../dto/equipo-pokemon/create-equipo-pokemon.dto';
import { UpdateEquipoPokemonDto } from '../dto/equipo-pokemon/update-equipo-pokemon.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('equipo')
@UseGuards(JwtAuthGuard)
export class EquipoController {
  constructor(private readonly equipoService: EquipoService) {}

  @Post()
  create(@Body() createEquipoDto: CreateEquipoDto, @Request() req: any) {
    return this.equipoService.create(createEquipoDto, req.user.id);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.equipoService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.equipoService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEquipoDto: UpdateEquipoDto,
    @Request() req: any,
  ) {
    return this.equipoService.update(id, updateEquipoDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.equipoService.remove(id, req.user.id);
  }

  @Post(':id/pokemon')
  addPokemon(
    @Param('id') equipoId: string,
    @Body() createEquipoPokemonDto: CreateEquipoPokemonDto,
    @Request() req: any,
  ) {
    return this.equipoService.addPokemon(
      equipoId,
      createEquipoPokemonDto,
      req.user.id,
    );
  }

  @Patch('pokemon/:pokemonId')
  updatePokemon(
    @Param('pokemonId') pokemonId: string,
    @Body() updateEquipoPokemonDto: UpdateEquipoPokemonDto,
    @Request() req: any,
  ) {
    return this.equipoService.updatePokemon(
      pokemonId,
      updateEquipoPokemonDto,
      req.user.id,
    );
  }

  @Delete('pokemon/:pokemonId')
  removePokemon(@Param('pokemonId') pokemonId: string, @Request() req: any) {
    return this.equipoService.removePokemon(pokemonId, req.user.id);
  }
}
