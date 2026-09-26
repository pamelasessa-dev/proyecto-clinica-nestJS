import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUsuarioDto {
  @ApiPropertyOptional({ description: 'Nombre del usuario.', example: 'Carlos' })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre?: string;

  @ApiPropertyOptional({ description: 'Apellido del usuario.', example: 'García' })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser un texto' })
  apellido?: string;

  @ApiPropertyOptional({ description: 'Email del usuario.', example: 'carlos@email.com' })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email?: string;

  @ApiPropertyOptional({ description: 'Nueva contraseña del usuario.', example: '12345678' })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;
}
