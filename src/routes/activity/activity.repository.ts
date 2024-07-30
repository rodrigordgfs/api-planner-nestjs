import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CreateActivityDTO } from './dto/create-activity.dto';
import dayjs from '../../lib/dayjs';
import { UpdateActivityDTO } from './dto/update-activity.dto';
import { ChangeDoneStatusActivityDTO } from './dto/change-done-status-activity.dto';

@Injectable()
export class ActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find(trip_id: string) {
    return await this.prisma.activity.findMany({
      where: {
        trip_id,
      },
    });
  }

  async findById(id: string) {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      throw new BadRequestException('Atividade não encontrada');
    }

    return activity;
  }

  async create(createActivityDTO: CreateActivityDTO) {
    const { occurs_at, title, trip_id } = createActivityDTO;

    const trip = await this.prisma.trip.findUnique({
      where: { id: trip_id },
    });

    if (!trip) {
      throw new BadRequestException('Viagem não encontrada');
    }

    const occursAtUtc = dayjs(occurs_at).utc().toDate();

    if (
      dayjs(occursAtUtc)
        .startOf('day')
        .isBefore(dayjs(trip.starts_at).startOf('day'))
    ) {
      throw new BadRequestException(
        'A atividade não pode ocorrer antes do início da viagem',
      );
    }

    if (
      dayjs(occursAtUtc)
        .startOf('day')
        .isAfter(dayjs(trip.ends_at).startOf('day'))
    ) {
      throw new BadRequestException(
        'A atividade não pode ocorrer após o término da viagem',
      );
    }

    return await this.prisma.activity.create({
      data: {
        title,
        occurs_at: occursAtUtc,
        trip_id: trip_id,
      },
    });
  }

  async update(id: string, updateActivityDTO: UpdateActivityDTO) {
    const { occurs_at, title } = updateActivityDTO;

    const activity = await this.prisma.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      throw new BadRequestException('Atividade não encontrada');
    }

    const trip = await this.prisma.trip.findUnique({
      where: { id: activity.trip_id },
    });

    if (
      dayjs(occurs_at)
        .startOf('day')
        .isBefore(dayjs(trip.starts_at).startOf('day'))
    ) {
      throw new BadRequestException(
        'A data da atividade deve ser a partir da data de início da viagem.',
      );
    }

    if (
      dayjs(occurs_at)
        .startOf('day')
        .isAfter(dayjs(trip.ends_at).startOf('day'))
    ) {
      throw new BadRequestException(
        'A data da atividade deve ser até a data de término da viagem.',
      );
    }

    return await this.prisma.activity.update({
      where: {
        id,
      },
      data: {
        title,
        occurs_at: new Date(occurs_at),
      },
    });
  }

  async delete(id: string) {
    return await this.prisma.activity.delete({
      select: { id: true },
      where: { id },
    });
  }

  async changeDoneStatus(
    id: string,
    changeDoneStatusActivityDTO: ChangeDoneStatusActivityDTO,
  ) {
    const { is_done } = changeDoneStatusActivityDTO;

    const activity = await this.prisma.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      throw new BadRequestException('Atividade não encontrada');
    }

    return await this.prisma.activity.update({
      select: { id: true, is_done: true },
      where: {
        id,
      },
      data: {
        is_done,
      },
    });
  }
}
