import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';


export class CreateMedicoDto {
    @IsString({ message: 'El nombre debe ser un texto'})
    @IsNotEmpty({ message: 'El nombre es un dato obligatorio'})
    @MinLength(2, { message: 'El nombre debe tener al menos dos letras'})
    @Matches(/\S/, { message: ' El nombre no puede contener solo espacios'})
    nombre: string;

    @IsString({ message: 'El apellido debe ser un texto'})
    @IsNotEmpty({ message: 'El apellido es un dato obligatorio'})
    @MinLength(2, { message: 'El apellido debe tener al menos dos letras'})
    @Matches(/\S/, { message: ' El apellido no puede contener solo espacios'})
    apellido: string;

    @IsInt({ message: 'El id de una especialidad debe ser un número entero'})
    @IsNotEmpty({ message: 'El id de la especialidad es obligatorio'})
    id_especialidad: number;
    
    @IsInt({ message: " El id de usuario debe ser un número entero"})
    @IsNotEmpty({ message: 'El id del usuario es obligatorio'})
    id_usuario: number;
}