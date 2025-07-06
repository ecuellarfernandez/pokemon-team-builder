import { IsString, IsNotEmpty } from 'class-validator';

export class CreateEquipoDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
