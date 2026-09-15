import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { PacientesService } from './pacientes.service.js';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const paciente = await this.pacientesService.findOne(Number(id));

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }
    return paciente;
  }
  @Post()
  create(@Body() body: any) {
    return this.pacientesService.create({
      CI: body.CI,
      nombre: body.nombre,
      apellido: body.apellido,
      fecha_nacimiento: new Date(body.fecha_nacimiento),
      direccion: body.direccion,
      telefono: body.telefono,
      email: body.email,
    });
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.pacientesService.update(Number(id), {
      nombre: body.nombre,
      apellido: body.apellido,
      fecha_nacimiento: body.fecha_nacimiento ? new Date(body.fecha_nacimiento) : undefined,
      direccion: body.direccion,
      telefono: body.telefono,
      email: body.email,
    });
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pacientesService.remove(Number(id));
  }
}
