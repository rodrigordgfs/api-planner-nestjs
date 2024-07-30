import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginAuthDTO {
  @ApiProperty()
  @IsEmail({}, { message: 'Email precisa ser um email válido' })
  email: string;

  @ApiProperty()
  @MinLength(6, { message: 'Senha precisa ter no mínimo 6 caracteres' })
  password: string;
}
