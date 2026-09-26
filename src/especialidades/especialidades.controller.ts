import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EspecialidadesService } from './especialidades.service.js';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto.js';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Rol } from '../generated/prisma/enums.js';
import{
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('especialidades')
export class EspecialidadesController {
  constructor(
    private readonly especialidadesService: EspecialidadesService,
  ) {}

  @ApiOperation({ 
    summary: 'Lista de las especialidades' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de especialidades obtenida correctamente.',
   })
  @Roles(Rol.RECEPCIONISTA, Rol.GERENCIA)
  @Get()
  findAll() {
    return this.especialidadesService.findAll();
  }

  @ApiOperation({ 
    summary: 'Obtiene una especialidad por su ID',
   })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la especialidad.', 
    example: 1, 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Especialidad encontrada.' 
  })
  @ApiResponse({ 
    status: 404, description: 'Especialidad no encontrada.', 
  })
  @Roles(Rol.RECEPCIONISTA, Rol.GERENCIA)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.especialidadesService.findOne(id);
  }

  @ApiOperation({ summary: 'Crear una especialidad' })
  @ApiBody({ type: CreateEspecialidadDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Especialidad creada correctamente.', 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Los datos enviados no cumplen las validaciones.', 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'La especialidad ya existe.' 
  })
  @Roles(Rol.GERENCIA)
  @Post()
  create(
    @Body() createEspecialidadDto: CreateEspecialidadDto,
  ) {
    return this.especialidadesService.create(
      createEspecialidadDto,
    );
  }

  @ApiOperation({ summary: 'Modificar una especialidad' })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la especialidad.', 
    example: 1 
  })
  @ApiBody({ type: UpdateEspecialidadDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Especialidad actualizada correctamente.', 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Especialidad no encontrada.', 
  })
  @Roles(Rol.GERENCIA)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEspecialidadDto: UpdateEspecialidadDto,
  ) {
    return this.especialidadesService.update(
      id,
      updateEspecialidadDto,
    );
  }

  @ApiOperation({ summary: 'Eliminar una especialidad' })
  @ApiParam({ name: 'id', 
    description: 'ID de la especialidad.', 
    example: 1, 
  })
  @ApiResponse({ 
    status: 200, description: 'Especialidad eliminada correctamente.', 
  })
  @ApiResponse({ 
    status: 404, description: 'Especialidad no encontrada.', 
  })
  @ApiResponse({ 
    status: 409, description: 'No se puede eliminar una especialidad con médicos asociados.' 
  })
  @Roles(Rol.GERENCIA)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.especialidadesService.remove(id);
  }
}