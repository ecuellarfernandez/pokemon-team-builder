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
import { MovimientoService } from './movimiento.service';
import { CreateMovimientoDto } from '../dto/movimiento/create-movimiento.dto';
import { UpdateMovimientoDto } from '../dto/movimiento/update-movimiento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('movimiento')
@UseGuards(JwtAuthGuard)
export class MovimientoController {
  constructor(private readonly movimientoService: MovimientoService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  create(@Body() createMovimientoDto: CreateMovimientoDto) {
    return this.movimientoService.create(createMovimientoDto);
  }

  @Get()
  findAll(@Query('name') name?: string) {
    return this.movimientoService.findAll(name);
  }

  @Get('search')
  search(@Query('name') name: string) {
    return this.movimientoService.findByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movimientoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateMovimientoDto: UpdateMovimientoDto,
  ) {
    return this.movimientoService.update(id, updateMovimientoDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.movimientoService.remove(id);
  }
}
