import {
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEspecialidadDto {
  @ApiProperty({ description: 'Nombre de la especialidad.', example: 'Cardiología' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es un dato obligatorio' })
  @MinLength(2, {
    message: 'El nombre debe tener al menos dos letras',
  })
  @Matches(/\S/, {
    message: 'El nombre no puede contener solo espacios',
  })
  nombre: string;
}