import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaMovimientoService } from './categoria-movimiento.service';
import { CategoriaMovimientoController } from './categoria-movimiento.controller';
import { CategoriaMovimiento } from '../entities/categoria-movimiento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaMovimiento])],
  controllers: [CategoriaMovimientoController],
  providers: [CategoriaMovimientoService],
  exports: [CategoriaMovimientoService],
})
export class CategoriaMovimientoModule {}
