import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipoService } from './equipo.service';
import { EquipoController } from './equipo.controller';
import { Equipo, EquipoPokemon, EquipoPokemonMovimiento } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Equipo, EquipoPokemon, EquipoPokemonMovimiento]),
  ],
  controllers: [EquipoController],
  providers: [EquipoService],
  exports: [EquipoService],
})
export class EquipoModule {}
