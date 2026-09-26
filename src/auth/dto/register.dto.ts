
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Nombre del usuario.',
    example: 'Ana'
  })
  @IsString({
    message: 'El nombre debe estar en formato de texto',
  })
  @IsNotEmpty({
    message: 'El nombre no puede estar vacío',
  })
  nombre: string;

  @ApiProperty({ 
    description: 'Apellido del usuario.', 
    example: 'Suarez',
   })
  @IsString({
    message: 'El apellido debe estar en formato de texto',
  })
  @IsNotEmpty({
    message: 'El apellido no puede estar vacío',
  })
  apellido: string;

  @ApiProperty({ 
    description: 'Email del usuario.', 
    example: 'ana@gmail.com',
   })
  @IsEmail(
    {}, 
  {
    message: 'El email debe tener un formato válido',
  })
  email: string;

  @ApiProperty({ 
    description: 'Contraseña del usuario.', 
    example: '12345678', 
  })
  @IsString({
    message: 'La contraseña debe estar en formato de texto',
  })
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres',
  })
  password: string;
}