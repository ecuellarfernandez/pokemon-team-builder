import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Max,
  IsArray,
  ArrayMaxSize,
  IsOptional,
} from 'class-validator';

export class CreateEquipoPokemonDto {
  @IsString()
  @IsNotEmpty()
  pokemon_id: string;

  @IsString()
  @IsNotEmpty()
  item_id: string;

  @IsString()
  @IsNotEmpty()
  habilidad_id: string;

  @IsString()
  @IsNotEmpty()
  nature_id: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

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
  @ArrayMaxSize(4)
  @IsString({ each: true })
  movimiento_ids: string[];
}
