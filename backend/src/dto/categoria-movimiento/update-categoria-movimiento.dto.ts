import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaMovimientoDto } from './create-categoria-movimiento.dto';

export class UpdateCategoriaMovimientoDto extends PartialType(
  CreateCategoriaMovimientoDto,
) {}
