import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDateString,
  MinLength,
  Matches,
} from 'class-validator';

export class CreatePacientDto {
  @IsString({ message: 'La Cédula debe ser una cadena de texto'})
  @IsNotEmpty({ message: 'La Cédula es obligatoria'})
  @Matches(/^\d+$/, { message: 'La Cédula debe contener únicamente números, sin puntos ni guiones'})
  CI: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres'})
  @Matches(/\S/, { message: 'El nombre no puede contener solo espacios'})
  nombre: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio'})
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres'})
  @Matches(/\S/, {message: 'El apellido no puede contener solo espacios'})
  apellido: string;

  @IsDateString(
    {},
    {
      message: 'La fecha de nacimiento debe ser una fecha válida',
    },
  )
  fecha_nacimiento: string;

  @IsString({ message: 'La dirección debe ser una cadena de texto'})
  @IsNotEmpty({ message: 'La dirección es obligatoria'})
  direccion: string;

  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio'})
  telefono: string;

  @IsEmail(
    {},
    {
      message: 'El email debe tener un formato válido',
    },
  )
  @IsNotEmpty({ message: 'El email es obligatorio'})
  email: string;
}
