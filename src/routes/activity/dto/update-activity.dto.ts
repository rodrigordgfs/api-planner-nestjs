import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, MinLength } from 'class-validator';

export class UpdateActivityDTO {
  @ApiProperty()
  @IsString({ message: 'Destino precisa ser um texto' })
  @MinLength(4, { message: 'Destino precisa ter no mínimo 4 caracteres' })
  title: string;

  @ApiProperty()
  @IsDateString(
    {},
    {
      message:
        'Data da atividade precisa ser uma data válida no formato ISO 8601',
    },
  )
  occurs_at: string;
}
