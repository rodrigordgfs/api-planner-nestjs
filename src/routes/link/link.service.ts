import { Injectable } from '@nestjs/common';
import { LinkRepository } from './link.repository';
import { CreateLinkDTO } from './dto/create-link.dto';
import { UpdateLinkDTO } from './dto/update-link.dto';

@Injectable()
export class LinkService {
  constructor(private readonly repository: LinkRepository) {}

  async findById(id: string) {
    return await this.repository.findById(id);
  }

  async find(trip_id: string) {
    return await this.repository.find(trip_id);
  }

  async create(createLinkDTO: CreateLinkDTO) {
    return await this.repository.create(createLinkDTO);
  }

  async update(id: string, updateLinkDTO: UpdateLinkDTO) {
    return await this.repository.update(id, updateLinkDTO);
  }

  async delete(id: string) {
    return await this.repository.delete(id);
  }
}
