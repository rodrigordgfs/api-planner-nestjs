import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { RegisterAuthDTO } from './dto/register-auth.dto';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async signInEmailPassword(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  }

  async signUpEmailPassword(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    return { data, error };
  }

  async deleteUser(id: string) {
    await this.supabase.auth.admin.deleteUser(id);
  }

  async register(id: string, registerAuthDTO: RegisterAuthDTO) {
    const { email, name } = registerAuthDTO;

    try {
      await this.prisma.user.create({
        data: {
          id,
          name,
          email,
        },
      });

      return {
        id,
        message: 'Usuário criado com sucesso. Por favor, confirme seu e-mail!',
      };
    } catch (err) {
      await this.deleteUser(id);
      throw new BadRequestException('Erro ao criar usuário na tabela local');
    }
  }
}
