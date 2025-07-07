import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Min,
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
  IsUUID,
} from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  type_1_id!: string;

  @IsString()
  @IsOptional()
  type_2_id?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  base_hp!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  base_atk!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  base_def!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  base_spa!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  base_spd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  base_spe!: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'El Pokémon debe tener al menos 1 habilidad' })
  @ArrayMaxSize(3, {
    message: 'El Pokémon no puede tener más de 3 habilidades',
  })
  @IsUUID('4', {
    each: true,
    message: 'Cada habilidad debe ser un UUID válido',
  })
  habilidad_ids!: string[];

  @IsArray()
  @IsOptional()
  @IsUUID('4', {
    each: true,
    message: 'Cada movimiento debe ser un UUID válido',
  })
  movimiento_ids?: string[];
}
