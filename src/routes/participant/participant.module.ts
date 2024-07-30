import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { ParticipantService } from './participant.service';
import { ParticipantRepository } from './participant.repository';

@Module({
  controllers: [ParticipantController],
  providers: [PrismaService, ParticipantService, ParticipantRepository],
})
export class ParticipantModule {}
