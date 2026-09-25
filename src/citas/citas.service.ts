import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateCitaDto } from './dto/create-cita.dto.js';
import { UpdateEstadoCitaDto } from './dto/update-estado-cita.dto.js';

interface AuthenticatedUser {
  sub: number;
  role: string;
}

@Injectable()
export class CitasService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    createCitaDto: CreateCitaDto,
  ) {
    const fechaHora = new Date(
      createCitaDto.fecha_hora,
    );

    if (fechaHora <= new Date()) {
      throw new BadRequestException(
        'La cita debe programarse para una fecha futura',
      );
    }

    return this.prisma.cita.create({
      data: {
        CI_paciente: createCitaDto.CI_paciente,
        id_medico: createCitaDto.id_medico,
        fecha_hora: fechaHora,
      },
    });
  }

  async findAll(
    user: AuthenticatedUser,
    desde?: string,
    hasta?: string,
  ) {
    const where: any = {};

    if (desde || hasta) {
      where.fecha_hora = {};

      if (desde) {
        where.fecha_hora.gte = new Date(desde);
      }

      if (hasta) {
        where.fecha_hora.lte = new Date(hasta);
      }
    }

    if (user.role === 'RECEPCIONISTA') {
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

    if (user.role === 'GERENCIA') {
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

    if (user.role === 'MEDICO') {
      const medico =
        await this.prisma.medico.findUnique({
          where: {
            id_usuario: user.sub,
          },
        });

      if (!medico) {
        throw new NotFoundException(
          'No existe un médico asociado al usuario autenticado',
        );
      }

      where.id_medico = medico.id_medico;

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

    throw new ForbiddenException(
      'No tienes permiso para consultar citas',
    );
  }

  async updateEstado(
    id_cita: number,
    dto: UpdateEstadoCitaDto,
    user: AuthenticatedUser,
  ) {
    const medico =
      await this.prisma.medico.findUnique({
        where: {
          id_usuario: user.sub,
        },
      });

    if (!medico) {
      throw new NotFoundException(
        'No existe un médico asociado al usuario autenticado',
      );
    }

    const cita =
      await this.prisma.cita.findUnique({
        where: {
          id_cita,
        },
      });

    if (!cita) {
      throw new NotFoundException(
        'Cita no encontrada',
      );
    }

    if (cita.id_medico !== medico.id_medico) {
      throw new ForbiddenException(
        'No puedes modificar una cita de otro médico',
      );
    }

    return this.prisma.cita.update({
      where: {
        id_cita,
      },
      data: {
        estado: dto.estado,
      },
    });
  }
}