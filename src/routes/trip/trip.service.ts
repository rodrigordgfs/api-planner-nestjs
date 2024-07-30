import { Injectable } from '@nestjs/common';
import { TripRepository } from './trip.repository';
import { CreateTripDTO } from './dto/create-trip.dto';
import { UpdateTripDTO } from './dto/update-trip.dto';

@Injectable()
export class TripService {
  constructor(private readonly repository: TripRepository) {}

  async find(user_id: string) {
    return await this.repository.find(user_id);
  }

  async findById(id: string) {
    return await this.repository.findById(id);
  }

  async create(createTripDTO: CreateTripDTO) {
    return await this.repository.create(createTripDTO);
  }

  async update(id: string, updateTripDTO: UpdateTripDTO) {
    return await this.repository.update(id, updateTripDTO);
  }

  async delete(id: string) {
    return await this.repository.delete(id);
  }
}
