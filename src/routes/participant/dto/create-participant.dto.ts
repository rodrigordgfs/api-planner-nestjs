import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsUUID } from 'class-validator';

export class CreateParticipantDTO {
  @ApiProperty()
  @IsUUID('4', { message: 'Id precisa ser um UUID versão 4' })
  trip_id: string;

  @ApiProperty()
  @IsEmail({}, { message: 'E-mail precisa ser um e-mail válido' })
  email: string;
}
