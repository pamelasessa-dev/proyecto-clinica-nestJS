import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class MedicosService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  findAll(id_especialidad?: number) {
    return this.prisma.medico.findMany({
      where: id_especialidad
        ? { id_especialidad }
        : undefined,
        include: {
          especialidad: true,
        },
    });
  }

  async findOne(id_medico: number) {
    const medico = await this.prisma.medico.findUnique({
      where: { id_medico },
      include: {
        especialidad: true,
      },
    });
     if (!medico) {
      throw new NotFoundException('Médico no encontrado');
    }

    return medico;
  }

  create(data: {
    nombre: string;
    apellido: string;
    id_especialidad: number;
    id_usuario: number;
  }) {
    return this.prisma.medico.create({
      data,
      include: {
        especialidad: true,
      },
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
    const medico =
      await this.prisma.medico.findUnique({
        where: { id_medico },
      });

    if (!medico) {
      throw new NotFoundException(
        'Médico no encontrado',
      );
    }

    return this.prisma.medico.update({
      where: { id_medico },
      data,
      include:{
        especialidad:true,
      }
    });
  }

  async remove(id_medico: number) {
    const medico =
      await this.prisma.medico.findUnique({
        where: { id_medico },
      });

    if (!medico) {
      throw new NotFoundException(
        'Médico no encontrado',
      );
    }

    await this.prisma.medico.delete({
      where: { id_medico },
    });

    return {
      message: 'Médico eliminado con éxito',
    };
  }
  async findCitas(
    id_usuario: number,
    desde?: string,
    hasta?: string,
  ) {
    const medico = await this.prisma.medico.findUnique({
      where: { id_usuario },
    });

    if (!medico) {
      throw new NotFoundException(
        'No existe un médico asociado al usuario autenticado',
      );
    }

    const where: {
      id_medico: number;
      fecha_hora?: { gte?: Date; lte?: Date };
    } = {
      id_medico: medico.id_medico,
    };

    if (desde || hasta) {
      where.fecha_hora = {};

      if (desde) {
        const fechaDesde = new Date(desde);
        if (Number.isNaN(fechaDesde.getTime())) {
          throw new BadRequestException('La fecha desde no es válida');
        }
        where.fecha_hora.gte = fechaDesde;
      }

      if (hasta) {
        const fechaHasta = new Date(hasta);
        if (Number.isNaN(fechaHasta.getTime())) {
          throw new BadRequestException('La fecha hasta no es válida');
        }
        where.fecha_hora.lte = fechaHasta;
      }

      if (
        where.fecha_hora.gte &&
        where.fecha_hora.lte &&
        where.fecha_hora.gte > where.fecha_hora.lte
      ) {
        throw new BadRequestException(
          'La fecha desde no puede ser posterior a la fecha hasta',
        );
      }
    }

    return this.prisma.cita.findMany({
      where,
      include: {
        paciente: true,
        medico: {
          include: {
            especialidad: true,
          },
        },
      },
      orderBy: {
        fecha_hora: 'asc',
      },
    });
  }
}
