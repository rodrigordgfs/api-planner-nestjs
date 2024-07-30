// src/app.module.ts
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PrismaService } from './lib/prisma/prisma.service';
import { UserModule } from './routes/user/user.module';
import { SupabaseModule } from './lib/supabase/supabase.module';
import { TripModule } from './routes/trip/trip.module';
import { LinkModule } from './routes/link/link.module';
import { ActivityModule } from './routes/activity/activity.module';
import { ParticipantModule } from './routes/participant/participant.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthModule } from './routes/auth/auth.module';

@Module({
  imports: [
    SupabaseModule,
    UserModule,
    TripModule,
    LinkModule,
    ActivityModule,
    ParticipantModule,
    AuthModule,
  ],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
