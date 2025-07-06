import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTipoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}