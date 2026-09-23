import { IsEnum } from 'class-validator'; 
import { Rol } from '../../generated/prisma/enums.js'; 

export class ChangeRoleDto { 
    @IsEnum(Rol) 
    rol: Rol; 
}