import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateNaturalezaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
