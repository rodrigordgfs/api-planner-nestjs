import { Module } from '@nestjs/common';
import { PrismaService } from './lib/prisma.service';
import { UserModule } from './user/user.module';
import { SupabaseModule } from './lib/supabase.module';

@Module({
  imports: [UserModule, SupabaseModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
