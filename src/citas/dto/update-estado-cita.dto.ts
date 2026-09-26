import { IsEnum } from 'class-validator';
import { EstadoCita } from '../../generated/prisma/enums.js';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEstadoCitaDto {
  @ApiProperty({
    description: 'Nuevo estado de la cita.',
    enum: EstadoCita,
    example: EstadoCita.COMPLETADA,
  })
  @IsEnum(EstadoCita, {
    message: 'El estado de la cita no es válido',
  })
  estado: EstadoCita;
}