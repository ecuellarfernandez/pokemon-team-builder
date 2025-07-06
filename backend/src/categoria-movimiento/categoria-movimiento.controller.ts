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
import { CreateCategoriaMovimientoDto } from '../dto/categoria-movimiento/create-categoria-movimiento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CategoriaMovimientoService } from './categoria-movimiento.service';
import { UpdateCategoriaMovimientoDto } from 'src/dto/categoria-movimiento/update-categoria-movimiento.dto';

@Controller('categoria-movimiento')
@UseGuards(JwtAuthGuard)
export class CategoriaMovimientoController {
  constructor(
    private readonly categoriaMovimientoService: CategoriaMovimientoService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  create(@Body() createCategoriaMovimientoDto: CreateCategoriaMovimientoDto) {
    return this.categoriaMovimientoService.create(createCategoriaMovimientoDto);
  }

  @Get()
  findAll(@Query('name') name?: string) {
    return this.categoriaMovimientoService.findAll(name);
  }

  @Get('search')
  search(@Query('name') name: string) {
    return this.categoriaMovimientoService.findByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaMovimientoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateCategoriaMovimientoDto: UpdateCategoriaMovimientoDto,
  ) {
    return this.categoriaMovimientoService.update(
      id,
      updateCategoriaMovimientoDto,
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.categoriaMovimientoService.remove(id);
  }
}
