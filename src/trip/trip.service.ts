import { Injectable } from '@nestjs/common';
import { TripRepository } from './trip.repository';
import { CreateTripDTO } from './dto/create-trip.dto';

@Injectable()
export class TripService {
  constructor(private readonly repository: TripRepository) {}

  async find(user_id: string) {
    return await this.repository.find(user_id);
  }

  async create(createTripDTO: CreateTripDTO) {
    return await this.repository.create(createTripDTO);
  }
}
