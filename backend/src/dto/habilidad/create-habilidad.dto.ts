import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateHabilidadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
