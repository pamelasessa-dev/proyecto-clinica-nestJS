import { IsDateString, IsInt } from 'class-validator';

export class CreateCitaDto {
  @IsInt()
  CI_paciente:number;

  @IsInt()
  id_medico:number;

  @IsDateString()
  fecha_hora: string;
}