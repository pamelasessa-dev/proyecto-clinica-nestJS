import { 
    Body, 
    Controller, 
    Get, 
    Post 
} from '@nestjs/common';

import { EspecialidadesService } from './especialidades.service.js';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto.js';

@Controller('especialidades')
export class EspecialidadesController {
  constructor(
    private readonly especialidadesService: EspecialidadesService,
  ) {}

  @Post()
  create(@Body() createEspecialidadDto: CreateEspecialidadDto) {
    return this.especialidadesService.create(createEspecialidadDto);
  }

  @Get()
  findAll() {
    return this.especialidadesService.findAll();
  }
}