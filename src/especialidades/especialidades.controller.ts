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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('especialidades')
export class EspecialidadesController {
  constructor(
    private readonly especialidadesService: EspecialidadesService,
  ) {}

  @Get()
  @Roles(Rol.RECEPCIONISTA, Rol.GERENCIA)
  findAll() {
    return this.especialidadesService.findAll();
  }

  @Post()
  @Roles(Rol.GERENCIA)
  create(
    @Body() createEspecialidadDto: CreateEspecialidadDto,
  ) {
    return this.especialidadesService.create(
      createEspecialidadDto,
    );
  }

  @Patch(':id')
  @Roles(Rol.GERENCIA)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEspecialidadDto: UpdateEspecialidadDto,
  ) {
    return this.especialidadesService.update(
      id,
      updateEspecialidadDto,
    );
  }

  @Delete(':id')
  @Roles(Rol.GERENCIA)
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.especialidadesService.remove(id);
  }
}