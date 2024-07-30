import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateUserDTO } from './dto/update-user-dto';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async find(email?: string) {
    return await this.repository.find(email);
  }

  async findById(id: string) {
    return await this.repository.findById(id);
  }

  async update(id: string, updateUserDTO: UpdateUserDTO) {
    return await this.repository.update(id, updateUserDTO);
  }
}
