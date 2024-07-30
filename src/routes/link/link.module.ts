import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LinkController } from './link.controller';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { LinkService } from './link.service';
import { LinkRepository } from './link.repository';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  controllers: [LinkController],
  providers: [PrismaService, LinkService, LinkRepository],
})
export class LinkModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
