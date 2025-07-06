import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabilidadService } from './habilidad.service';
import { HabilidadController } from './habilidad.controller';
import { Habilidad } from '../entities/habilidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Habilidad])],
  controllers: [HabilidadController],
  providers: [HabilidadService],
  exports: [HabilidadService],
})
export class HabilidadModule {}
