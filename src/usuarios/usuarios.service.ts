import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';

@Injectable()
export class UsuariosService {
    constructor(private readonly prisma: PrismaService){}

    async findAll(){
        return this.prisma.usuario.findMany();
    }
    async findOne(id:number){
        return this.prisma.usuario.findUnique({
            where: { id },
        });
    }
    async findByEmail(email:string){
        return this.prisma.usuario.findUnique({
            where: { email },
        });
    }
    async create(createUsuarioDto: CreateUsuarioDto){
        return this.prisma.usuario.create({
            data: createUsuarioDto,
        });
    }
    async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
        return this.prisma.usuario.update({
            where: { id },
            data: updateUsuarioDto,
        });
    }
    async remove(id:number){
        return this.prisma.usuario.delete({
            where: { id },
        });
    }

}

