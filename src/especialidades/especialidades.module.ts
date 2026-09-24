import { Module } from '@nestjs/common';
import { EspecialidadesController } from './especialidades.controller.js';
import { EspecialidadesService } from './especialidades.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
@Module({
  imports: [PrismaModule],
  controllers: [EspecialidadesController],
  providers: [EspecialidadesService]
})
export class EspecialidadesModule {}
