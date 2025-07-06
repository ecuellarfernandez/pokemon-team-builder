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
import { CreateTipoDto } from '../dto/tipo/create-tipo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { TipoService } from './tipo.service';
import { UpdateTipoDto } from 'src/dto/tipo/update-tipo.dto';

@Controller('tipo')
@UseGuards(JwtAuthGuard)
export class TipoController {
  constructor(private readonly tipoService: TipoService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  create(@Body() createTipoDto: CreateTipoDto) {
    return this.tipoService.create(createTipoDto);
  }

  @Get()
  findAll(@Query('name') name?: string) {
    return this.tipoService.findAll(name);
  }

  @Get('search')
  search(@Query('name') name: string) {
    return this.tipoService.findByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateTipoDto: UpdateTipoDto) {
    return this.tipoService.update(id, updateTipoDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.tipoService.remove(id);
  }
}
