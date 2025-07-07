import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipoPokemonDto } from './create-equipo-pokemon.dto';
import {
  IsOptional,
  IsNumber,
  IsArray,
  IsString,
  Min,
  Max,
  ArrayMaxSize,
  ArrayUnique,
  ArrayMinSize,
} from 'class-validator';
import { IsPokemonAbilityValid, IsPokemonMovesValid } from '../../validators';

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
  @ArrayMaxSize(4, {
    message: 'Un Pokémon no puede tener más de 4 movimientos',
  })
  @ArrayMinSize(1, { message: 'Un Pokémon debe tener al menos 1 movimiento' })
  @ArrayUnique({ message: 'No se pueden asignar movimientos duplicados' })
  @IsString({ each: true })
  @IsPokemonMovesValid()
  movimiento_ids?: string[];

  @IsOptional()
  @IsString()
  @IsPokemonAbilityValid()
  habilidad_id?: string;
}
