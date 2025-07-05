import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoService } from './movimiento.service';
import { MovimientoController } from './movimiento.controller';
import { Movimiento } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Movimiento])],
  controllers: [MovimientoController],
  providers: [MovimientoService],
  exports: [MovimientoService],
})
export class MovimientoModule {}
