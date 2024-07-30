import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { TripRepository } from './trip.repository';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  controllers: [TripController],
  providers: [PrismaService, TripService, TripRepository],
})
export class TripModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
