import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCategoriaMovimientoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
