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
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from '../dto/pokemon/create-pokemon.dto';
import { UpdatePokemonDto } from '../dto/pokemon/update-pokemon.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('pokemon')
@UseGuards(JwtAuthGuard)
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  create(@Body() createPokemonDto: CreatePokemonDto) {
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
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(id, updatePokemonDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.pokemonService.remove(id);
  }
}
