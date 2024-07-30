import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CreateTripDTO } from './dto/create-trip.dto';
import dayjs from '../lib/dayjs';

@Injectable()
export class TripRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find(user_id: string) {
    return await this.prisma.trip.findMany({
        where: { 
            participants: {
              some: {
                user_id
              }
            }
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
              }
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

  async create(createTripDTO: CreateTripDTO) {
    const { user_id, destination, emails_to_invite, ends_at, starts_at } =
      createTripDTO;

    const user = await this.prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) {
        throw new BadRequestException('Usuário não encontrado.');
    }

    if (dayjs(starts_at).isBefore(dayjs(), 'day')) {
      throw new BadRequestException('A data de início deve ser maior ou igual à data atual.');
    }

    if (dayjs(ends_at).isBefore(starts_at)) {
      throw new BadRequestException('A data de término deve ser maior que a data de início.');
    }

    const participants = (
      await Promise.all(
        emails_to_invite.map(async (email) => {
          const invitedUser = await this.prisma.user.findUnique({
            where: { email },
          });
          if (invitedUser) {
            return {
              user_id: invitedUser.id,
              is_owner: false,
              is_confirmed: false,
            };
          }
        }),
      )
    ).filter(Boolean) as Array<{
      user_id: string;
      is_owner: boolean;
      is_confirmed: boolean;
    }>;

    participants.push({
      user_id,
      is_owner: true,
      is_confirmed: true,
    });

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
}
