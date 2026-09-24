import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { PacientesModule } from './pacientes/pacientes.module.js';
import { MedicosModule } from './medicos/medicos.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { CitasModule } from './citas/citas.module.js';
import { ConfigModule } from '@nestjs/config';
import { EspecialidadesModule } from './especialidades/especialidades.module.js';
import { envValidationSchema } from './config/env.validation.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        libraryOptions: {
          allowUnknown: false,
          abortEarly: false,
        },
      },
    }),

    PrismaModule,
    AuthModule,
    UsuariosModule,
    PacientesModule,
    MedicosModule,
    CitasModule,
    EspecialidadesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
