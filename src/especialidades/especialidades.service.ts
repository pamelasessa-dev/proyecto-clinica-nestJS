import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateEspecialidadDto } from './dto/create-especialidad.dto.js';

@Injectable()
export class EspecialidadesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createEspecialidadDto: CreateEspecialidadDto) {
    return this.prisma.especialidad.create({
      data: {
        nombre: createEspecialidadDto.nombre,
      },
    });
  }

  findAll() {
    return this.prisma.especialidad.findMany();
  }
}