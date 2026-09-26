import {
  IsDateString,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCitaDto {

  @ApiProperty({
    description: 'CI del paciente que tendrá la cita.',
    example: 12345678,
  })
  @IsInt({
    message: 'El CI del paciente debe ser un número entero',
  })
  @IsNotEmpty({
    message: 'El CI del paciente es obligatorio',
  })
  CI_paciente: number;

  @ApiProperty({
    description: 'ID del médico que atenderá la cita.',
    example: 1,
  })
  @IsInt({
    message: 'El ID del médico debe ser un número entero',
  })
  @IsNotEmpty({
    message: 'El ID del médico es obligatorio',
  })
  id_medico: number;

  @ApiProperty({
    description: 'Fecha y hora de la cita',
    example: '2026-10-01T10:00:00.000Z',
  })
  @IsDateString(
    {},
    {
      message:
        'La fecha y hora de la cita deben tener un formato válido',
    },
  )
  @IsNotEmpty({
    message: 'La fecha y hora de la cita son obligatorias',
  })
  fecha_hora: string;
}