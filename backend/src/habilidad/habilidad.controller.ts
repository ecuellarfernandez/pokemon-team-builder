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
import { CreateHabilidadDto } from '../dto/habilidad/create-habilidad.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { HabilidadService } from './habilidad.service';
import { UpdateHabilidadDto } from 'src/dto/habilidad/update-habilidad.dto';

@Controller('habilidad')
@UseGuards(JwtAuthGuard)
export class HabilidadController {
  constructor(private readonly habilidadService: HabilidadService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  create(@Body() createHabilidadDto: CreateHabilidadDto) {
    return this.habilidadService.create(createHabilidadDto);
  }

  @Get()
  findAll(@Query('name') name?: string) {
    return this.habilidadService.findAll(name);
  }

  @Get('search')
  search(@Query('name') name: string) {
    return this.habilidadService.findByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.habilidadService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateHabilidadDto: UpdateHabilidadDto,
  ) {
    return this.habilidadService.update(id, updateHabilidadDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.habilidadService.remove(id);
  }
}
