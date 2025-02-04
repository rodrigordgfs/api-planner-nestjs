import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsUUID, MinLength } from 'class-validator';

export class CreateLinkDTO {
  @ApiProperty()
  @IsUUID('4', { message: 'Id precisa ser um UUID versão 4' })
  trip_id: string;

  @ApiProperty()
  @IsString({ message: 'Titulo precisa ser um texto' })
  @MinLength(4, { message: 'Titulo precisa ter no mínimo 4 caracteres' })
  title: string;

  @ApiProperty()
  @IsUrl({}, { message: 'URL precisa ser uma URL válida' })
  url: string;
}
