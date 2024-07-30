import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { ParticipantService } from './participant.service';
import { ParticipantRepository } from './participant.repository';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  controllers: [ParticipantController],
  providers: [PrismaService, ParticipantService, ParticipantRepository],
})
export class ParticipantModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
