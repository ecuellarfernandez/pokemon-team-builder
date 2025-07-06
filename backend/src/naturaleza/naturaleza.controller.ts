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
import { CreateNaturalezaDto } from '../dto/naturaleza/create-naturaleza.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { NaturalezaService } from './naturaleza.service';
import { UpdateNaturalezaDto } from 'src/dto/naturaleza/update-naturaleza.dto';

@Controller('naturaleza')
@UseGuards(JwtAuthGuard)
export class NaturalezaController {
  constructor(private readonly naturalezaService: NaturalezaService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  create(@Body() createNaturalezaDto: CreateNaturalezaDto) {
    return this.naturalezaService.create(createNaturalezaDto);
  }

  @Get()
  findAll(@Query('name') name?: string) {
    return this.naturalezaService.findAll(name);
  }

  @Get('search')
  search(@Query('name') name: string) {
    return this.naturalezaService.findByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.naturalezaService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateNaturalezaDto: UpdateNaturalezaDto,
  ) {
    return this.naturalezaService.update(id, updateNaturalezaDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.naturalezaService.remove(id);
  }
}
