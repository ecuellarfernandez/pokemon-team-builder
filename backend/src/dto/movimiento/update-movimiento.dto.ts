import { PartialType } from '@nestjs/mapped-types';
import { CreateMovimientoDto } from './create-movimiento.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateMovimientoDto extends PartialType(CreateMovimientoDto) {}
