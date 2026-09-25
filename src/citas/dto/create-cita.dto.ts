import {
  IsDateString,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class CreateCitaDto {
  @IsInt({
    message: 'El CI del paciente debe ser un número entero',
  })
  @IsNotEmpty({
    message: 'El CI del paciente es obligatorio',
  })
  CI_paciente: number;

  @IsInt({
    message: 'El ID del médico debe ser un número entero',
  })
  @IsNotEmpty({
    message: 'El ID del médico es obligatorio',
  })
  id_medico: number;

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