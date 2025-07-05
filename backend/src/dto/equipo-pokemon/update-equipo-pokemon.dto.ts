import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipoPokemonDto } from './create-equipo-pokemon.dto';
import {
  IsOptional,
  IsNumber,
  IsArray,
  IsString,
  Min,
  Max,
} from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateEquipoPokemonDto extends PartialType(
  CreateEquipoPokemonDto,
) {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(252)
  ev_hp?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(252)
  ev_atk?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(252)
  ev_def?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(252)
  ev_spa?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(252)
  ev_spd?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(252)
  ev_spe?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  movimiento_ids?: string[];
}
