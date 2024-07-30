import {
  IsString,
  MinLength,
  IsUUID,
  IsDateString,
  IsArray,
} from 'class-validator';

export class CreateTripDTO {
  @IsUUID('4', { message: 'Id precisa ser um UUID versão 4' })
  user_id: string;

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

  @IsArray({ message: 'Acompanhantes precisa ser um array' })
  @IsString({
    each: true,
    message: 'Acompanhantes precisa ser um array de textos',
  })
  emails_to_invite: string[];
}
