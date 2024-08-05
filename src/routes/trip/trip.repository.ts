import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CreateTripDTO } from './dto/create-trip.dto';
import dayjs from '../../lib/dayjs';
import { UpdateTripDTO } from './dto/update-trip.dto';

@Injectable()
export class TripRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find(user_id: string) {
    return await this.prisma.trip.findMany({
      where: {
        participants: {
          some: {
            user_id,
          },
        },
      },
      select: {
        id: true,
        destination: true,
        starts_at: true,
        ends_at: true,
        participants: {
          select: {
            id: true,
            is_confirmed: true,
            is_owner: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image_url: true,
              },
            },
          },
        },
        _count: {
          select: {
            participants: true,
            activities: true,
            links: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.trip.findUnique({
      where: { id },
      select: {
        id: true,
        destination: true,
        starts_at: true,
        ends_at: true,
      },
    });
  }

  async findByIdWithActivities(id: string) {
    return await this.prisma.trip.findUnique({
      where: { id },
      include: { activities: true },
    });
  }

  async create(
    createTripDTO: CreateTripDTO,
    participants: Array<{
      user_id: string;
      is_owner: boolean;
      is_confirmed: boolean;
    }>,
  ) {
    const { user_id, destination, ends_at, starts_at } = createTripDTO;

    return await this.prisma.trip.create({
      select: { id: true },
      data: {
        user_id,
        destination,
        starts_at: dayjs(starts_at).toDate(),
        ends_at: dayjs(ends_at).toDate(),
        participants: {
          createMany: {
            data: participants,
          },
        },
      },
    });
  }

  async findConflictingActivitiesStartsAt(trip_id: string, starts_at: string) {
    return await this.prisma.activity.findMany({
      where: {
        trip_id,
        occurs_at: {
          lt: starts_at,
        },
        is_done: false,
      },
    });
  }

  async findConflictingActivitiesEndsAt(trip_id: string, ends_at: string) {
    return await this.prisma.activity.findMany({
      where: {
        trip_id,
        occurs_at: {
          gt: ends_at,
        },
        is_done: false,
      },
    });
  }

  async update(id: string, updateTripDTO: UpdateTripDTO) {
    const { destination, ends_at, starts_at } = updateTripDTO;

    return await this.prisma.trip.update({
      where: {
        id: id,
      },
      data: {
        destination,
        starts_at: new Date(starts_at),
        ends_at: new Date(ends_at),
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.trip.delete({
      select: { id: true },
      where: {
        id,
      },
    });
  }
}
