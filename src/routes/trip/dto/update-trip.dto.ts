import { IsString, MinLength, IsDateString } from 'class-validator';

export class UpdateTripDTO {
  @IsString({ message: 'Destino precisa ser um texto' })
  @MinLength(4, { message: 'Destino precisa ter no mínimo 4 caracteres' })
  destination: string;

  @IsDateString(
    {},
    {
      message: 'Data de início precisa ser uma data válida no formato ISO 8601',
    },
  )
  starts_at: string;

  @IsDateString(
    {},
    {
      message:
        'Data de término precisa ser uma data válida no formato ISO 8601',
    },
  )
  ends_at: string;
}
