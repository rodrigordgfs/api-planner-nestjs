import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { LoginAuthDTO } from './dto/login-auth.dto';
import { RegisterAuthDTO } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  async login(loginAuthDTO: LoginAuthDTO) {
    return await this.repository.login(loginAuthDTO);
  }

  async register(registerAuthDTO: RegisterAuthDTO) {
    return await this.repository.register(registerAuthDTO);
  }
}
