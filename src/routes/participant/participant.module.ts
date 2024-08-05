import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { ParticipantService } from './participant.service';
import { ParticipantRepository } from './participant.repository';
import { TripRepository } from '../trip/trip.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  controllers: [ParticipantController],
  providers: [
    PrismaService,
    ParticipantService,
    ParticipantRepository,
    TripRepository,
    UserRepository,
  ],
})
export class ParticipantModule {}
