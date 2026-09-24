import {
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateEspecialidadDto {
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