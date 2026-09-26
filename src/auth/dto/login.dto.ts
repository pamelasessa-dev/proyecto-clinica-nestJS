import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {

  @ApiProperty({ 
    description: 'Email del usuario.',
     example: 'usuario@gmail.com', 
  })
  @IsEmail({}, {
    message: 'El email debe tener un formato válido',
  })
  @IsNotEmpty({
    message: 'El email es obligatorio',
  })
  email: string;

  @ApiProperty({ 
    description: 'Contraseña del usuario.', 
    example: '12345678',
  })
  @IsString({
    message: 'La contraseña debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'La contraseña es obligatoria',
  })
  @MinLength(6, {
    message: 'La contraseña debe tener al menos 6 caracteres',
  })
  password: string;
}