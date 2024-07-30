import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [PrismaService, UserService, UserRepository],
})
export class UserModule {}
