import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Min,
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
}
