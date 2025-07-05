import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsOptional, IsString } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  role_id?: string;
}
