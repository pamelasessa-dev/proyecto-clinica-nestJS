import { Module } from '@nestjs/common';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { PacientesModule } from './pacientes/pacientes.module.js';
import { MedicosModule } from './medicos/medicos.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsuariosController } from './usuarios/usuarios.controller.js';
import { UsuariosService } from './usuarios/usuarios.service.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { CitasModule } from './citas/citas.module.js';

@Module({
  imports: [
    PrismaModule,
    PacientesModule,
    MedicosModule,
    AuthModule,
    UsuariosModule,
    CitasModule,
  ],
  controllers: [AppController, UsuariosController],
  providers: [AppService, UsuariosService],
})
export class AppModule {}