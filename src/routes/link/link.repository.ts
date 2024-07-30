import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CreateLinkDTO } from './dto/create-link.dto';
import { UpdateLinkDTO } from './dto/update-link.dto';

@Injectable()
export class LinkRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const link = await this.prisma.link.findUnique({
      where: { id },
    });

    if (!link) {
      throw new BadRequestException('Link não encontrado');
    }

    return link;
  }

  async find(trip_id: string) {
    return await this.prisma.link.findMany({
      where: { trip_id },
    });
  }

  async create(createLinkDTO: CreateLinkDTO) {
    const { title, trip_id, url } = createLinkDTO;

    const trip = await this.prisma.trip.findUnique({
      where: { id: trip_id },
    });

    if (!trip) {
      throw new BadRequestException('Viagem não encontrada');
    }

    return await this.prisma.link.create({
      data: {
        title,
        url,
        trip_id: trip_id,
      },
    });
  }

  async update(id: string, updateLinkDTO: UpdateLinkDTO) {
    const { title, url } = updateLinkDTO;

    const link = await this.prisma.link.findUnique({
      where: { id },
    });

    if (!link) {
      throw new BadRequestException('Link não encontrado');
    }

    return await this.prisma.link.update({
      where: { id },
      data: {
        title,
        url,
      },
    });
  }

  async delete(id: string) {
    const link = await this.prisma.link.findUnique({
      where: { id },
    });

    if (!link) {
      throw new BadRequestException('Link não encontrado');
    }

    return await this.prisma.link.delete({
      select: { id: true },
      where: { id },
    });
  }
}
