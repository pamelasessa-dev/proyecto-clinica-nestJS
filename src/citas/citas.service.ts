import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { PacientesService } from '../pacientes/pacientes.service.js';
import { scheduled } from 'rxjs';

@Injectable()
export class CitasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pacientesService: PacientesService
  ) {}

  async create(data: { 
    pacienteCI: number;
    idMedico:number; 
    scheduledAt: Date;
}) {
    const paciente = await this.pacientesService.findOne(data.pacienteCI)
    if (!paciente) throw new NotFoundException('El paciente no existe')

    return this.prisma.cita.create({
    data: {
        fecha_hora: data.scheduledAt,
        CI_paciente: data.pacienteCI,
        id_medico:data.idMedico,
        },
  });

}

  findAll() {
    return this.prisma.cita.findMany()
  }
}