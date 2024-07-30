import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { LoginAuthDTO } from './dto/login-auth.dto';
import { RegisterAuthDTO } from './dto/register-auth.dto';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async login(loginAuthDTO: LoginAuthDTO) {
    const { email, password } = loginAuthDTO;

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

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
    const { email, name, password } = registerAuthDTO;

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data || !data.user) {
      throw new BadRequestException('Erro ao criar usuário');
    }

    try {
      const userId = data.user.id;

      await this.prisma.user.create({
        data: {
          id: userId,
          name,
          email,
        },
      });

      return {
        id: userId,
        message: 'Usuário criado com sucesso. Por favor, confirme seu e-mail!',
      };
    } catch (err) {
      await this.supabase.auth.admin.deleteUser(data.user.id);
      throw new BadRequestException('Erro ao criar usuário na tabela local');
    }
  }
}
