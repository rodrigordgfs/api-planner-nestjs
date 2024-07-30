import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterAuthDTO {
  @ApiProperty()
  @IsString({ message: 'Nome precisa ser um texto' })
  @MinLength(3, { message: 'Nome precisa ter no mínimo 3 caracteres' })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Email precisa ser um email válido' })
  email: string;

  @ApiProperty()
  @MinLength(6, { message: 'Senha precisa ter no mínimo 6 caracteres' })
  password: string;
}
