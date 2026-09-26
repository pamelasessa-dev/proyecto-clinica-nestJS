import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';
import { Rol } from '../../generated/prisma/enums.js';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioAdminDto {
  @ApiProperty({ description: 'Nombre del usuario.', example: 'Carlos' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @ApiProperty({ description: 'Apellido del usuario.', example: 'García' })
  @IsString({ message: 'El apellido debe ser un texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  apellido: string;

  @ApiProperty({ description: 'Email del usuario.', example: 'carlos@email.com' })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email: string;

  @ApiProperty({ description: 'Contraseña del usuario.', example: '12345678' })
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({ 
    description: 'Rol del usuario.', 
    enum: Rol, example: Rol.RECEPCIONISTA,
 })
  @IsEnum(Rol, { message: 'El rol no es válido' })
  rol: Rol;
}
