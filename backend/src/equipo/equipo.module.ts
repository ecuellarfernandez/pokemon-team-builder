import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipoService } from './equipo.service';
import { EquipoController } from './equipo.controller';
import {
  Equipo,
  EquipoPokemon,
  EquipoPokemonMovimiento,
  PokemonMovimiento,
  PokemonHabilidad,
} from '../entities';
import {
  IsPokemonMovesValidConstraint,
  IsPokemonAbilityValidConstraint,
} from '../validators';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Equipo,
      EquipoPokemon,
      EquipoPokemonMovimiento,
      PokemonMovimiento,
      PokemonHabilidad,
    ]),
  ],
  controllers: [EquipoController],
  providers: [
    EquipoService,
    IsPokemonMovesValidConstraint,
    IsPokemonAbilityValidConstraint,
  ],
  exports: [EquipoService],
})
export class EquipoModule {}
