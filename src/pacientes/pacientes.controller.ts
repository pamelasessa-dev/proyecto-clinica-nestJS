import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PacientesService } from './pacientes.service.js';
import { CreatePacienteDto } from './dto/create-paciente.dto.js';
import { UpdatePacienteDto } from './dto/update-paciente.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Rol } from '../generated/prisma/enums.js';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';


@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Rol.RECEPCIONISTA)
@ApiBearerAuth('JWT-auth')
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

 @ApiOperation({ summary: 'Lista todos los pacientes' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de pacientes obtenida correctamente.', 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token no proporcionado o inválido.', 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'El usuario no tiene el rol requerido.', 
  })
  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }

  @ApiOperation({ summary: 'Obtiene un paciente por CI' })
  @ApiParam({ 
    name: 'id', 
    description: 'Cédula de identidad del paciente', 
    example: 12345678, 
  })
  @ApiResponse({ status: 200, description: 'Paciente encontrado.' })
  @ApiResponse({ status: 400, description: 'El CI debe ser un número entero.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const paciente = await this.pacientesService.findOne(Number(id));

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }
    return paciente;
  }

  @ApiOperation({ 
    summary: 'Consulta el expediente e historial de citas de un paciente' 
  })
  @ApiParam({ 
    name: 'CI', 
    description: 'Cédula de identidad del paciente', 
    example: 12345678 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Expediente e historial de citas obtenidos correctamente.',
   })
  @ApiResponse({ 
    status: 404, 
    description: 'Paciente no encontrado.', 
  })
  @Get(':CI/expediente')
  findExpediente(@Param('CI', ParseIntPipe) CI: number) {
    return this.pacientesService.findExpediente(CI);
  }

  @ApiOperation({ summary: 'Crea un nuevo registro de paciente' })
  @ApiBody({ type: CreatePacienteDto })
  @ApiResponse({ status: 201, 
    description: 'Paciente creado correctamente.' })
  @ApiResponse({ status: 400, 
    description: 'Los datos enviados no cumplen las validaciones.' })
  @ApiResponse({ status: 409, 
    description: 'El email o CI ya están registrados.' })
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
  @ApiParam({ 
    name: 'id', 
    description: 'Cédula de identidad del paciente', 
    example: 12345678 })
  @ApiBody({ type: UpdatePacienteDto })
  @ApiResponse({ status: 200, 
    description: 'Paciente actualizado correctamente.' })
  @ApiResponse({ status: 400, 
    description: 'Los datos enviados no cumplen las validaciones.' })
  @ApiResponse({ status: 404, 
    description: 'Paciente no encontrado.' })
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

  @ApiOperation({ summary: 'Elimina un paciente' })
  @ApiParam({ 
    name: 'id', 
    description: 'Cédula de identidad del paciente', 
    example: 12345678 
  })
  @ApiResponse({ status: 200, 
    description: 'Paciente eliminado correctamente.' })
  @ApiResponse({ status: 404, 
    description: 'Paciente no encontrado.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pacientesService.remove(Number(id));
  }
}
