import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString({
    message: 'El nombre debe ser un texto',
  })
  nombre?: string;

  @IsOptional()
  @IsString({
    message: 'El apellido debe ser un texto',
  })
  apellido?: string;

  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'El email debe tener un formato válido',
    },
  )
  email?: string;

  @IsOptional()
  @IsString({
    message: 'La contraseña debe ser un texto',
  })
  @MinLength(6, {
    message: 'La contraseña debe tener al menos 6 caracteres',
  })
  password?: string;
}
