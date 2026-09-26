import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { UsuariosService } from './usuarios.service.js';
import { CreateUsuarioAdminDto } from './dto/create-usuario-admin.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
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


@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Rol.GERENCIA)
@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
  ) {}

  @ApiOperation({ summary: 'Lista de los usuarios' })
  @ApiResponse({ status: 200, 
    description: 'Lista de usuarios obtenida correctamente.' })
  @ApiResponse({ status: 403, 
    description: 'Solo GERENCIA puede consultar usuarios.' })
  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @ApiOperation({ summary: 'Obtiene un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario.', example: 1 })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usuariosService.findOne(id);
  }

  @ApiOperation({ summary: 'Crea un usuario desde GERENCIA' })
  @ApiBody({ type: CreateUsuarioAdminDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado correctamente.',
   })
  @ApiResponse({ 
    status: 400, 
    description: 'Los datos enviados no cumplen las validaciones.',
   })
  @ApiResponse({ 
    status: 409, 
    description: 'El email ya está registrado.' 
  })
  @Post()
  create(
    @Body() createUsuarioDto: CreateUsuarioAdminDto,
  ) {
    return this.usuariosService.create(
      createUsuarioDto,
    );
  }

  @ApiOperation({ summary: 'Modifica un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario.', example: 1 })
  @ApiBody({ type: UpdateUsuarioDto })
  @ApiResponse({ 
    status: 200, description: 'Usuario actualizado correctamente.', 
  })
  @ApiResponse({ 
    status: 404, description: 'Usuario no encontrado.', 
  })
  @ApiResponse({ 
    status: 409, description: 'El email ya está registrado.', 
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(
      id,
      updateUsuarioDto,
    );
  }

  @ApiOperation({ summary: 'Elimina un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario.', example: 1 })
  @ApiResponse({ 
    status: 200, description: 'Usuario eliminado correctamente.' })
  @ApiResponse({ 
    status: 404, description: 'Usuario no encontrado.' })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usuariosService.remove(id);
  }
}