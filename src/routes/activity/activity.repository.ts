import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CreateActivityDTO } from './dto/create-activity.dto';
import { UpdateActivityDTO } from './dto/update-activity.dto';
import { ChangeDoneStatusActivityDTO } from './dto/change-done-status-activity.dto';

@Injectable()
export class ActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.activity.findUnique({
      where: { id },
    });
  }

  async create(createActivityDTO: CreateActivityDTO) {
    const { occurs_at, title, trip_id } = createActivityDTO;

    return await this.prisma.activity.create({
      data: {
        title,
        occurs_at,
        trip_id,
      },
    });
  }

  async update(id: string, updateActivityDTO: UpdateActivityDTO) {
    const { occurs_at, title } = updateActivityDTO;

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
