import {
  Body,
  Controller,
  Get,
  Post,

} from '@nestjs/common';
import { CitasService} from './citas.service.js';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @ApiOperation({summary:'Crear una nueva cita'})
  @Post()
  create(@Body() body: any) {
    return this.citasService.create(body)
  }

  @ApiOperation({summary: 'Lista de todas las citas'})
  @Get()
  findAll() {
    return this.citasService.findAll()
  }
}