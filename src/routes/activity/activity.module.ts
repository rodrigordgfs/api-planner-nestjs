import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { ActivityRepository } from './activity.repository';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  controllers: [ActivityController],
  providers: [PrismaService, ActivityService, ActivityRepository],
})
export class ActivityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
