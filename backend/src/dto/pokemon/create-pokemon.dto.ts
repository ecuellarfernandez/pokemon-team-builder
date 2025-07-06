import {
  IsString,
  IsNumber,
  IsUrl,
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

  @IsNumber()
  @Min(1)
  base_hp!: number;

  @IsNumber()
  @Min(1)
  base_atk!: number;

  @IsNumber()
  @Min(1)
  base_def!: number;

  @IsNumber()
  @Min(1)
  base_spa!: number;

  @IsNumber()
  @Min(1)
  base_spd!: number;

  @IsNumber()
  @Min(1)
  base_spe!: number;

  @IsUrl()
  @IsNotEmpty()
  image_url!: string;
}
