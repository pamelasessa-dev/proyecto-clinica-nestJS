import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PacientesService } from './pacientes.service.js';
import { CreatePacienteDto } from './dto/create-paciente.dto.js';
import { UpdatePacienteDto } from './dto/update-paciente.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('RECEPCIONISTA')
@ApiBearerAuth()
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @ApiOperation({ summary: 'Lista de los pacientes' })
  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }

  @ApiOperation({ summary: 'Obtiene un paciente por ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const paciente = await this.pacientesService.findOne(Number(id));

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }
    return paciente;
  }

  @ApiOperation({ summary: 'Crea un nuevo registro de paciente' })
  @Post()
  create(@Body() body: CreatePacienteDto) {
    return this.pacientesService.create({
      CI: Number(body.CI),
      nombre: body.nombre,
      apellido: body.apellido,
      fecha_nacimiento: new Date(body.fecha_nacimiento),
      direccion: body.direccion,
      telefono: body.telefono,
      email: body.email,
    });
  }
  @ApiOperation({ summary: 'Modifica los datos de un paciente' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdatePacienteDto) {
    return this.pacientesService.update(Number(id), {
      nombre: body.nombre,
      apellido: body.apellido,
      fecha_nacimiento: body.fecha_nacimiento
        ? new Date(body.fecha_nacimiento)
        : undefined,
      direccion: body.direccion,
      telefono: body.telefono,
      email: body.email,
    });
  }
  @ApiOperation({ summary: 'Eliminar un paciente' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pacientesService.remove(Number(id));
  }
}
