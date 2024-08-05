import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { LoginAuthDTO } from './dto/login-auth.dto';
import { RegisterAuthDTO } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  async login(loginAuthDTO: LoginAuthDTO) {
    const { email, password } = loginAuthDTO;

    const { data, error } = await this.repository.signInEmailPassword(
      email,
      password,
    );

    if (error) {
      if (error.message === 'Email not confirmed') {
        throw new BadRequestException(
          'Por favor, verifique seu email antes de fazer login.',
        );
      } else {
        throw new BadRequestException('Email ou senha inválidos');
      }
    }

    if (!data.user || !data.session) {
      throw new BadRequestException('Email ou senha inválidos');
    }

    return {
      id: data.user.id,
      token: data.session.access_token,
    };
  }

  async register(registerAuthDTO: RegisterAuthDTO) {
    const { email, password } = registerAuthDTO;

    const { data, error } = await this.repository.signUpEmailPassword(
      email,
      password,
    );

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data || !data.user) {
      throw new BadRequestException('Erro ao criar usuário');
    }

    return await this.repository.register(data.user.id, registerAuthDTO);
  }
}
