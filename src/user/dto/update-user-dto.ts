import { IsOptional, IsString, MinLength, Matches } from 'class-validator';

export class UpdateUserDTO {
  @IsString({ message: 'Nome precisa ser um texto' })
  @MinLength(4, { message: 'Nome precisa ter no mínimo 4 caracteres' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Image precisa ser um texto' })
  @Matches(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/, {
    message: 'Image precisa ser uma base64',
  })
  image?: string;
}
