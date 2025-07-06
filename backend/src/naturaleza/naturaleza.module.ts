import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NaturalezaService } from './naturaleza.service';
import { NaturalezaController } from './naturaleza.controller';
import { Naturaleza } from '../entities/naturaleza.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Naturaleza])],
  controllers: [NaturalezaController],
  providers: [NaturalezaService],
  exports: [NaturalezaService],
})
export class NaturalezaModule {}
