import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';

@Module({
  controllers: [AuthController],
  providers: [PrismaService, AuthService, AuthRepository],
})
export class AuthModule {}
