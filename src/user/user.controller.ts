import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/update-user-dto';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  async find(@Query('email') email?: string) {
    return await this.service.find(email);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDTO: UpdateUserDTO) {
    return await this.service.update(id, updateUserDTO);
  }
}
