import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipoDto } from './create-equipo.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateEquipoDto extends PartialType(CreateEquipoDto) {}
