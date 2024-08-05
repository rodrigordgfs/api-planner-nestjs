import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CreateParticipantDTO } from './dto/create-participant.dto';

@Injectable()
export class ParticipantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const participant = await this.prisma.participant.findUnique({
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

    if (!participant) {
      throw new BadRequestException('Participante não encontrado');
    }

    return participant;
  }

  async find(user_id: string, trip_id: string) {
    if (trip_id) {
      const trip = await this.prisma.trip.findUnique({
        where: { id: trip_id },
      });

      if (!trip) {
        throw new BadRequestException('Viagem não encontrada');
      }
    }

    if (user_id) {
      const user = await this.prisma.user.findUnique({
        where: { id: user_id },
      });

      if (!user) {
        throw new BadRequestException('Usuário não encontrado');
      }
    }

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

  async create(createParticipantDTO: CreateParticipantDTO) {
    const { email, trip_id } = createParticipantDTO;

    const trip = await this.prisma.trip.findUnique({
      where: { id: trip_id },
    });

    if (!trip) {
      throw new BadRequestException('Viagem não encontrada');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('Usuário não cadastrado na plataforma');
    }

    const participantExists = await this.prisma.participant.findFirst({
      where: {
        user_id: user.id,
        trip_id: trip_id,
      },
    });

    if (participantExists) {
      throw new BadRequestException(
        'Participante já convidado para esta viagem',
      );
    }

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
        user_id: user.id,
        trip_id: trip_id,
      },
    });
  }

  async delete(id: string) {
    const participant = await this.prisma.participant.findUnique({
      where: { id },
    });

    if (!participant) {
      throw new BadRequestException('Participante não encontrado');
    }

    if (participant.is_owner) {
      throw new BadRequestException(
        'Não é possível remover o proprietário da viagem',
      );
    }

    return await this.prisma.participant.delete({
      select: { id: true },
      where: { id },
    });
  }

  async confirmParticipant(id: string) {
    const participant = await this.prisma.participant.findUnique({
      where: { id },
    });

    if (!participant) {
      throw new BadRequestException('Participante não encontrado');
    }

    if (participant?.is_confirmed) {
      throw new BadRequestException('Participante já confirmado');
    }

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
        id: participant.id,
      },
      data: {
        is_confirmed: true,
      },
    });
  }
}
