import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { ActivityRepository } from './activity.repository';

@Module({
  controllers: [ActivityController],
  providers: [PrismaService, ActivityService, ActivityRepository],
})
export class ActivityModule {}
