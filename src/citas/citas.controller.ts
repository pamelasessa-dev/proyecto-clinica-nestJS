import {
  Body,
  Controller,
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CitasService } from './citas.service.js';
import { CreateCitaDto } from './dto/create-cita.dto.js';
import { UpdateEstadoCitaDto } from './dto/update-estado-cita.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Rol } from '../generated/prisma/enums.js';

type AuthenticatedRequest = Request & {
  user: {
    sub: number;
    role: string;
  };
};

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('citas')
export class CitasController {
  constructor(
    private readonly citasService: CitasService,
  ) {}

  @ApiOperation({
    summary: 'Crear una nueva cita',
  })
  @ApiBody({ 
    type: CreateCitaDto, 
  })
  @ApiResponse({ 
    status: 201,
    description: 'Cita creada correctamente.',
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos o la cita está en el pasado.', 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Paciente o médico no encontrado.', 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'El paciente o médico ya tiene una cita en ese horario.', 
  })
  @Roles(Rol.RECEPCIONISTA)
  @Post()
  create(
    @Body() createCitaDto: CreateCitaDto,
  ) {
    return this.citasService.create(
      createCitaDto,
    );
  }

  @ApiOperation({
    summary: 'Consultar citas',
  })
  @ApiQuery({ 
    name: 'desde', 
    required: false, 
    description: 'Fecha/hora', 
    example: '2026-10-01T00:00:00.000Z',
  })
  @ApiQuery({ 
    name: 'hasta', 
    required: false, 
    description: 'Fecha/hora', 
    example: '2026-10-31T23:59:59.999Z', 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de citas obtenida correctamente.',
   })
  @ApiResponse({ 
    status: 400, 
    description: 'El rango de fechas no es válido.' 
  })
  @Roles(
    Rol.RECEPCIONISTA,
    Rol.MEDICO,
    Rol.GERENCIA,
  )
  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return this.citasService.findAll(
      req.user,
      desde,
      hasta,
    );
  }
  
  @ApiOperation({
    summary: 'Actualizar el estado de una cita',
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la cita.', 
    example: 1 
  })
  @ApiBody({ 
    type: UpdateEstadoCitaDto, 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado de la cita actualizado correctamente.' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'El estado enviado no es válido.' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'El médico no puede modificar una cita que no le corresponde.' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cita o médico no encontrado.' 
  })
  @Roles(Rol.MEDICO)
  @Patch(':id/estado')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstadoCitaDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.citasService.updateEstado(
      id,
      dto,
      req.user,
    );
  }
}