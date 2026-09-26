import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto.js';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto.js';

@Injectable()
export class EspecialidadesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(
    createEspecialidadDto: CreateEspecialidadDto,
  ) {
    return this.prisma.especialidad.create({
      data: {
        nombre: createEspecialidadDto.nombre,
      },
    });
  }

  findAll() {
    return this.prisma.especialidad.findMany({
      orderBy: {
        nombre:'asc',
      },
    });
  }
  async findOne(id_especialidad: number) {
    const especialidad = await this.prisma.especialidad.findUnique({
      where: { id_especialidad },
      include: {
        medicos: true,
      },
    });

    if (!especialidad) {
      throw new NotFoundException('Especialidad no encontrada');
    }

    return especialidad;
  }
  async update(
    id_especialidad: number,
    updateEspecialidadDto: UpdateEspecialidadDto,
  ) {
    const especialidad =
      await this.prisma.especialidad.findUnique({
        where: { id_especialidad },
      });

    if (!especialidad) {
      throw new NotFoundException(
        'Especialidad no encontrada',
      );
    }

    return this.prisma.especialidad.update({
      where: { id_especialidad },
      data: updateEspecialidadDto,
    });
  }

  async remove(id_especialidad: number) {
    const especialidad =
      await this.prisma.especialidad.findUnique({
        where: { id_especialidad },
        include: {
          medicos: true,
        },
      });

    if (!especialidad) {
      throw new NotFoundException(
        'Especialidad no encontrada',
      );
    }

    if (especialidad.medicos.length > 0) {
      throw new ConflictException(
        'No se puede eliminar una especialidad que tiene médicos asociados',
      );
    }

    await this.prisma.especialidad.delete({
      where: { id_especialidad },
    });

    return {
      message: 'Especialidad eliminada con éxito',
    };
  }
}