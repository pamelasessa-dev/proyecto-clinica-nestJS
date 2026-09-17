import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class MedicosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.medico.findMany();
  }
  findOne(id_medico: number) {
    return this.prisma.medico.findUnique({
      where: { id_medico },
    });
  }
  create(data: {
    nombre: string;
    apellido: string;
    id_especialidad: number;
    id_usuario: number;
  }) {
    return this.prisma.medico.create({
      data,
    });
  }
  async update(
    id_medico: number,
    data: {
      nombre?: string;
      apellido?: string;
      id_especialidad?: number;
      id_usuario?: number;
    },
  ) {
    const medico = await this.prisma.medico.findUnique({
      where: { id_medico },
    });
    if(!medico){
      throw new NotFoundException('Médico no encontrado')
    }
    return this.prisma.medico.update({
      where: { id_medico },
      data,
    });
  }
  async remove(id_medico: number) {
    const medico = await this.prisma.medico.findUnique({
      where: { id_medico},
    });
    if(!medico){
      throw new NotFoundException('Medico no encontrado');
    }
    await this.prisma.medico.delete({
        where: { id_medico },
      });
      return{
        message: 'Medico eliminado con éxito',
      };
    }
}