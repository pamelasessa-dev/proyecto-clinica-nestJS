import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { MedicosService } from './medicos.service.js';
import { CreateMedicoDto } from './dto/create-medico.dto.js';
import { UpdateMedicoDto } from './dto/update-medico.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Rol } from '../generated/prisma/enums.js';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

type AuthenticatedRequest = Request & {
  user: {
    sub: number;
    role: string;
  };
};

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('medicos')
export class MedicosController {
  constructor(
    private readonly medicosService: MedicosService,
  ) {}

  @ApiOperation({ 
    summary: 'Consulta lista de médicos y permite filtrar por especialidad',
  })
  @ApiQuery({ 
    name: 'id_especialidad', 
    required: false, 
    description: 'ID de la especialidad por la que se desea filtrar.', 
    example: 1,
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de médicos obtenida correctamente.' 
  })
  @Roles(Rol.RECEPCIONISTA, Rol.GERENCIA)
  @Get()
  findAll(
    @Query('id_especialidad')
    id_especialidad?: string,
  ) {
    const idEspecialidad = id_especialidad
      ? Number(id_especialidad)
      : undefined;

    return this.medicosService.findAll(
      idEspecialidad,
    );
  }

  @ApiOperation({ 
    summary: 'Consulta la agenda del médico autenticado por rango de fechas' 
  })
  @ApiQuery({ 
    name: 'desde', 
    required: false, 
    description: 'Fecha/hora inicial del rango', 
    example: '2026-10-01T00:00:00.000Z', 
  })
  @ApiQuery({ 
    name: 'hasta', 
    required: false, 
    description: 'Fecha/hora final del rango', 
    example: '2026-10-31T23:59:59.999Z', 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Agenda del médico autenticado obtenida correctamente.' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'El rango de fechas no es válido.' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'No existe un médico asociado al usuario autenticado.', 
  })
  @Roles(Rol.MEDICO)
  @Get('citas')
  findCitas(
    @Req() req: AuthenticatedRequest,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.medicosService.findCitas(req.user.sub, desde, hasta);
  }

  @ApiOperation({ 
    summary: 'Obtiene un médico por su ID', 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del médico.', 
    example: 1 
  })
  @ApiResponse({ 
    status: 200, description: 'Médico encontrado.', 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Médico no encontrado.', 
  })
  @Roles(Rol.RECEPCIONISTA, Rol.GERENCIA)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.medicosService.findOne(id);
  }
  
  @ApiOperation({ summary: 'Crea un médico' })
  @ApiBody({ type: CreateMedicoDto })
  @ApiResponse({ 
    status: 201, description: 'Médico creado correctamente.', 
  })
  @ApiResponse({ 
    status: 400, description: 'Los datos enviados no cumplen las validaciones.', 
  })
  @ApiResponse({ 
    status: 404, description: 'La especialidad o usuario relacionado no existe.', 
  })
  @ApiResponse({ 
    status: 409, description: 'El usuario ya está asociado a otro médico.', 
  })
  @Roles(Rol.GERENCIA)
  @Post()
  create(@Body() dto: CreateMedicoDto) {
    return this.medicosService.create(dto);
  }

  @ApiOperation({ summary: 'Modifica un médico' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del médico.', 
    example: 1 
  })
  @ApiBody({ type: UpdateMedicoDto })
  @ApiResponse({ 
    status: 200, description: 'Médico actualizado correctamente.', 
  })
  @ApiResponse({ 
    status: 404, description: 'Médico no encontrado.',
   })
  @ApiResponse({ 
    status: 409, 
    description: 'El usuario ya está asociado a otro médico.', 
  })
  @Roles(Rol.GERENCIA)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMedicoDto,
  ) {
    return this.medicosService.update(id, dto);
  }

  @ApiOperation({ 
    summary: 'Elimina un médico', 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del médico.', 
    example: 1, 
  })
  @ApiResponse({ 
    status: 200, description: 'Médico eliminado correctamente.', 
  })
  @ApiResponse({ 
    status: 404, description: 'Médico no encontrado.', 
  })
  @ApiResponse({ 
    status: 409, description: 'No se puede eliminar el médico por relaciones existentes.', 
  })
  @Roles(Rol.GERENCIA)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.medicosService.remove(id);
  }
}