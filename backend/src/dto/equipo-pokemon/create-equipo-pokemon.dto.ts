import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Max,
  IsArray,
  ArrayMaxSize,
  IsOptional,
  ArrayUnique,
  ArrayMinSize,
} from 'class-validator';
import { IsPokemonAbilityValid, IsPokemonMovesValid } from '../../validators';

export class CreateEquipoPokemonDto {
  @IsString()
  @IsNotEmpty()
  pokemon_id!: string;

  @IsString()
  @IsNotEmpty()
  item_id!: string;

  @IsString()
  @IsNotEmpty()
  @IsPokemonAbilityValid()
  habilidad_id!: string;

  @IsString()
  @IsNotEmpty()
  nature_id!: string;

  @IsString()
  @IsNotEmpty()
  nickname!: string;

  @IsNumber()
  @Min(0)
  @Max(252)
  @IsOptional()
  ev_hp?: number = 0;

  @IsNumber()
  @Min(0)
  @Max(252)
  @IsOptional()
  ev_atk?: number = 0;

  @IsNumber()
  @Min(0)
  @Max(252)
  @IsOptional()
  ev_def?: number = 0;

  @IsNumber()
  @Min(0)
  @Max(252)
  @IsOptional()
  ev_spa?: number = 0;

  @IsNumber()
  @Min(0)
  @Max(252)
  @IsOptional()
  ev_spd?: number = 0;

  @IsNumber()
  @Min(0)
  @Max(252)
  @IsOptional()
  ev_spe?: number = 0;

  @IsNumber()
  @Min(0)
  @Max(31)
  @IsOptional()
  iv_hp?: number = 31;

  @IsNumber()
  @Min(0)
  @Max(31)
  @IsOptional()
  iv_atk?: number = 31;

  @IsNumber()
  @Min(0)
  @Max(31)
  @IsOptional()
  iv_def?: number = 31;

  @IsNumber()
  @Min(0)
  @Max(31)
  @IsOptional()
  iv_spa?: number = 31;

  @IsNumber()
  @Min(0)
  @Max(31)
  @IsOptional()
  iv_spd?: number = 31;

  @IsNumber()
  @Min(0)
  @Max(31)
  @IsOptional()
  iv_spe?: number = 31;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  nivel?: number = 100;

  @IsArray()
  @ArrayMaxSize(4, {
    message: 'Un Pokémon no puede tener más de 4 movimientos',
  })
  @ArrayMinSize(1, { message: 'Un Pokémon debe tener al menos 1 movimiento' })
  @ArrayUnique({ message: 'No se pueden asignar movimientos duplicados' })
  @IsString({ each: true })
  @IsPokemonMovesValid()
  movimiento_ids!: string[];
}
