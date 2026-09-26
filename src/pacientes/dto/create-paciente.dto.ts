import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDateString,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePacienteDto {

  @ApiProperty({
    description: 'Cédula de identidad del paciente, sin puntos ni guiones.',
    example: '12345678',
  })
  @IsString({ message: 'La Cédula debe ser una cadena de texto'})
  @IsNotEmpty({ message: 'La Cédula es obligatoria'})
  @Matches(/^\d+$/, { message: 'La Cédula debe contener únicamente números, sin puntos ni guiones'})
  CI: string;

  @ApiProperty({ description: 'Nombre del paciente.', example: 'Ana' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres'})
  @Matches(/\S/, { message: 'El nombre no puede contener solo espacios'})
  nombre: string;

  @ApiProperty({ description: 'Apellido del paciente.', example: 'Pérez' })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio'})
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres'})
  @Matches(/\S/, {message: 'El apellido no puede contener solo espacios'})
  apellido: string;

  
  @ApiProperty({ 
    description: 'Fecha de nacimiento', 
    example: '1998-05-12' 
  })
  @IsDateString(
    {},
    {
      message: 'La fecha de nacimiento debe ser una fecha válida',
    },
  )
  fecha_nacimiento: string;

  @ApiProperty({ description: 'Dirección del paciente.', 
    example: '18 de Julio 1234',
   })
  @IsString({ message: 'La dirección debe ser una cadena de texto'})
  @IsNotEmpty({ message: 'La dirección es obligatoria'})
  direccion: string;

  @ApiProperty({ description: 'Teléfono del paciente.', example: '099123456' })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio'})
  telefono: string;

  @ApiProperty({ description: 'Email del paciente.', example: 'ana.perez@gmail.com' })
  @IsEmail(
    {},
    {
      message: 'El email debe tener un formato válido',
    },
  )
  @IsNotEmpty({ message: 'El email es obligatorio'})
  email: string;
}
