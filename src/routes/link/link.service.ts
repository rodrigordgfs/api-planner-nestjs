import { BadRequestException, Injectable } from '@nestjs/common';
import { LinkRepository } from './link.repository';
import { CreateLinkDTO } from './dto/create-link.dto';
import { UpdateLinkDTO } from './dto/update-link.dto';
import { TripRepository } from '../trip/trip.repository';

@Injectable()
export class LinkService {
  constructor(
    private readonly linkRepository: LinkRepository,
    private readonly tripRepository: TripRepository,
  ) {}

  async findById(id: string) {
    const link = await this.linkRepository.findById(id);

    if (!link) {
      throw new BadRequestException('Link não encontrado');
    }

    return link;
  }

  async find(trip_id: string) {
    return await this.linkRepository.find(trip_id);
  }

  async create(createLinkDTO: CreateLinkDTO) {
    const { trip_id } = createLinkDTO;

    const trip = await this.tripRepository.findById(trip_id);

    if (!trip) {
      throw new BadRequestException('Viagem não encontrada');
    }

    return await this.linkRepository.create(createLinkDTO);
  }

  async update(id: string, updateLinkDTO: UpdateLinkDTO) {
    const link = await this.linkRepository.findById(id);

    if (!link) {
      throw new BadRequestException('Link não encontrado');
    }

    return await this.linkRepository.update(id, updateLinkDTO);
  }

  async delete(id: string) {
    const link = await this.linkRepository.findById(id);

    if (!link) {
      throw new BadRequestException('Link não encontrado');
    }

    return await this.linkRepository.delete(id);
  }
}
