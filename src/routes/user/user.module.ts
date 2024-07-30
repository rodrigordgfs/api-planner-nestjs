import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  controllers: [UserController],
  providers: [PrismaService, UserService, UserRepository],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
