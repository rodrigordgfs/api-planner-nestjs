import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async find(email?: string) {
    return await this.repository.find(email);
  }

  async findById(id: string) {
    return await this.repository.findById(id);
  }
}
