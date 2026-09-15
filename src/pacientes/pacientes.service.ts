import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class PacientesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.paciente.findMany()
  }
  findOne(CI:number){
    return this,this.prisma.paciente.findUnique({
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
    return this.prisma.paciente.create({
      data,
    });
  }
  update(CI:number,
    data:{      
      nombre?: string;
      apellido?: string;
      fecha_nacimiento?: Date;
      direccion?: string;
      telefono?: string;
      email?: string;
    },
  ){
    return this.prisma.paciente.update({
      where: {CI},
      data,
    });
  }
  remove(CI:number){
    return this.prisma.paciente.delete({
      where: {CI},
    });
  }
}