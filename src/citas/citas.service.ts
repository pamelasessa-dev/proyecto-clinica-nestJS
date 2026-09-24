import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCitaDto } from './dto/create-cita.dto.js';

@Injectable()
export class CitasService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(createCitaDto: CreateCitaDto) {
    return this.prisma.cita.create({
      data: {
        CI_paciente: createCitaDto.CI_paciente,
        id_medico: createCitaDto.id_medico,
        fecha_hora: new Date(createCitaDto.fecha_hora),
      },
    });
  }

  findAll() {
    return this.prisma.cita.findMany();
  }
}
