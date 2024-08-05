import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CreateParticipantDTO } from './dto/create-participant.dto';

@Injectable()
export class ParticipantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.participant.findUnique({
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image_url: true,
          },
        },
        is_confirmed: true,
        is_owner: true,
      },
      where: { id },
    });
  }

  async find(user_id: string, trip_id: string) {
    return await this.prisma.participant.findMany({
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image_url: true,
          },
        },
        trip_id: true,
        is_confirmed: true,
        is_owner: true,
      },
      where: {
        trip_id,
        user_id,
      },
    });
  }

  async findConfirmedParticipantsNotOwner(trip_id: string) {
    return await this.prisma.participant.findMany({
      where: {
        trip_id,
        is_confirmed: true,
        is_owner: false,
      },
    });
  }

  async findParticipantOnTrip(user_id: string, trip_id: string) {
    return await this.prisma.participant.findFirst({
      where: {
        user_id,
        trip_id,
      },
    });
  }

  async create(user_id: string, createParticipantDTO: CreateParticipantDTO) {
    const { trip_id } = createParticipantDTO;

    return await this.prisma.participant.create({
      select: {
        id: true,
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      data: {
        user_id,
        trip_id,
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.participant.delete({
      select: { id: true },
      where: { id },
    });
  }

  async confirmParticipant(id: string) {
    return await this.prisma.participant.update({
      select: {
        id: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image_url: true,
          },
        },
        is_confirmed: true,
        is_owner: true,
      },
      where: {
        id,
      },
      data: {
        is_confirmed: true,
      },
    });
  }
}
