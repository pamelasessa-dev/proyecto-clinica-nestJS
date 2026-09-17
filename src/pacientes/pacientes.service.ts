import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service.js";
@Injectable()
export class PacientesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.paciente.findMany()
  }
  findOne(CI:number){
    return this.prisma.paciente.findUnique({
      where:{CI},
    });
  }
  create(data:{
    CI:number;
    nombre: string;
    apellido: string;
    fecha_nacimiento: Date;
    direccion: string;
    telefono: string;
    email: string;
  }) {
    if(data.fecha_nacimiento > new Date()){
      throw new BadRequestException('La fecha de nacimiento no puede ser futura ');
    }

    return this.prisma.paciente.create({
      data,
    });
  }
  async update(CI:number,
    data:{      
      nombre?: string;
      apellido?: string;
      fecha_nacimiento?: Date;
      direccion?: string;
      telefono?: string;
      email?: string;
    }){
      const paciente = await this.prisma.paciente.findUnique({
        where: { CI },
      });
      if (!paciente){
        throw new NotFoundException('Paciente no encontrado');
      }
      if(data.fecha_nacimiento && data.fecha_nacimiento > new Date()){
        throw new BadRequestException('La fecha de nacimiento no puede ser futura');
      }
      
      return this.prisma.paciente.update({
        where: {CI},
        data,
      });
    } 
    async remove(CI:number){
      const paciente = await this.prisma.paciente.findUnique({
        where: { CI },
      });
      if(!paciente){
        throw new NotFoundException('Paciente no encontrado');
      }
      await this.prisma.paciente.delete({
        where: { CI },
      });

      return{
        message: 'Paciente eliminado con éxito',
      };
    }
}