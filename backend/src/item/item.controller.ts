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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ItemService } from './item.service';
import { CreateItemDto } from '../dto/item/create-item.dto';
import { UpdateItemDto } from '../dto/item/update-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UploadService } from '../upload/upload.service';

@Controller('item')
@UseGuards(JwtAuthGuard)
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createItemDto: CreateItemDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ) {
    if (imageFile) {
      return this.uploadService.createItemWithImage(createItemDto, imageFile);
    }
    return this.itemService.create(createItemDto);
  }

  @Get()
  findAll(@Query('name') name?: string) {
    return this.itemService.findAll(name);
  }

  @Get('search')
  search(@Query('name') name: string) {
    return this.itemService.findByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @UploadedFile() imageFile?: Express.Multer.File,
  ) {
    if (imageFile) {
      return this.uploadService.updateItemWithImage(
        id,
        updateItemDto,
        imageFile,
      );
    }
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.itemService.remove(id);
  }
}
