import { Injectable } from '@nestjs/common';
import { ParticipantRepository } from './participant.repository';
import { CreateParticipantDTO } from './dto/create-participant.dto';

@Injectable()
export class ParticipantService {
  constructor(private readonly repository: ParticipantRepository) {}

  async findById(id: string) {
    return await this.repository.findById(id);
  }

  async find(user_id: string, trip_id: string) {
    return await this.repository.find(user_id, trip_id);
  }

  async create(createParticipantDTO: CreateParticipantDTO) {
    return await this.repository.create(createParticipantDTO);
  }

  async delete(id: string) {
    return await this.repository.delete(id);
  }

  async confirmParticipant(id: string) {
    return await this.repository.confirmParticipant(id);
  }
}
