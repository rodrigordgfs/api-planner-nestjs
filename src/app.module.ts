import { Module } from '@nestjs/common';
import { PrismaService } from './lib/prisma/prisma.service';
import { UserModule } from './routes/user/user.module';
import { SupabaseModule } from './lib/supabase/supabase.module';
import { TripModule } from './routes/trip/trip.module';
import { LinkModule } from './routes/link/link.module';

@Module({
  imports: [SupabaseModule, UserModule, TripModule, LinkModule],
  providers: [PrismaService],
})
export class AppModule {}
