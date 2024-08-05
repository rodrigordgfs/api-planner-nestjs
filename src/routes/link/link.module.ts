import { Module } from '@nestjs/common';
import { LinkController } from './link.controller';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { LinkService } from './link.service';
import { LinkRepository } from './link.repository';
import { TripRepository } from '../trip/trip.repository';

@Module({
  controllers: [LinkController],
  providers: [PrismaService, LinkService, LinkRepository, TripRepository],
})
export class LinkModule {}
