import { Module } from '@nestjs/common';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { TripRepository } from './trip.repository';

@Module({
  controllers: [TripController],
  providers: [PrismaService, TripService, TripRepository],
})
export class TripModule {}
