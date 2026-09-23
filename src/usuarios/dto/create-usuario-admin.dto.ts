import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';
import { Rol } from '../../generated/prisma/enums.js';

export class CreateUsuarioAdminDto {
    @IsString({ message: 'El nombre debe ser un texto'})
    @IsNotEmpty({message: 'El nombre es obligatorio'})
    nombre: string;
    
    @IsString({ message: 'El apellido debe ser un texto'})
    @IsNotEmpty({message: 'El apellido es obligatorio'})
    apellido: string;

    @IsEmail({},{message:'El email debe tener un formato válido'})
    email: string;

    @IsString({message:'La contraseña debe ser un texto'})
    @MinLength(6, {message:'La contraseña debe tener al menos 6 caracteres'})
    password:string;

    @IsEnum(Rol, {message:'El rol no es válido'})
    rol: Rol;

    
}