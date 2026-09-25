import { IsEnum } from 'class-validator';

import { EstadoCita } from '../../generated/prisma/enums.js';

export class UpdateEstadoCitaDto {
  @IsEnum(EstadoCita, {
    message: 'El estado de la cita no es válido',
  })
  estado: EstadoCita;
}