import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateMovimientoDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  type_id!: string;

  @IsString()
  @IsNotEmpty()
  categoria_id!: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  power?: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  accuracy!: number;

  @IsString()
  @IsNotEmpty()
  description!: string;
}
