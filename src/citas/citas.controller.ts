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
  ApiOperation,
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