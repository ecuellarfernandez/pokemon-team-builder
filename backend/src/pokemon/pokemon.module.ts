import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonHabilidad, PokemonMovimiento } from '../entities';
import { UploadModule } from '../upload/upload.module';
import { HabilidadModule } from '../habilidad/habilidad.module';
import { MovimientoModule } from '../movimiento/movimiento.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pokemon, PokemonHabilidad, PokemonMovimiento]),
    UploadModule,
    HabilidadModule,
    MovimientoModule,
  ],
  controllers: [PokemonController],
  providers: [PokemonService],
  exports: [PokemonService],
})
export class PokemonModule {}
