import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateNaturalezaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  stat_aumentada?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  stat_disminuida?: string;
}
