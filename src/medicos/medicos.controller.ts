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
  UseGuards,
} from '@nestjs/common';

import { MedicosService } from './medicos.service.js';
import { CreateMedicoDto } from './dto/create-medico.dto.js';
import { UpdateMedicoDto } from './dto/update-medico.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Rol } from '../generated/prisma/enums.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('medicos')
export class MedicosController {
  constructor(
    private readonly medicosService: MedicosService,
  ) {}

  @Get()
  @Roles(Rol.RECEPCIONISTA, Rol.GERENCIA)
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

  @Get(':id')
  @Roles(Rol.RECEPCIONISTA, Rol.GERENCIA)
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.medicosService.findOne(id);
  }

  @Post()
  @Roles(Rol.GERENCIA)
  create(@Body() dto: CreateMedicoDto) {
    return this.medicosService.create(dto);
  }

  @Patch(':id')
  @Roles(Rol.GERENCIA)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMedicoDto,
  ) {
    return this.medicosService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Rol.GERENCIA)
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.medicosService.remove(id);
  }
}