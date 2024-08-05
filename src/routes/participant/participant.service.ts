import { BadRequestException, Injectable } from '@nestjs/common';
import { ParticipantRepository } from './participant.repository';
import { CreateParticipantDTO } from './dto/create-participant.dto';
import { TripRepository } from '../trip/trip.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class ParticipantService {
  constructor(
    private readonly participantRepository: ParticipantRepository,
    private readonly tripRepository: TripRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async findById(id: string) {
    const participant = await this.participantRepository.findById(id);

    if (!participant) {
      throw new BadRequestException('Participante não encontrado');
    }

    return participant;
  }

  async find(user_id: string, trip_id: string) {
    if (trip_id) {
      const trip = await this.tripRepository.findById(trip_id);

      if (!trip) {
        throw new BadRequestException('Viagem não encontrada');
      }
    }

    if (user_id) {
      const user = await this.userRepository.findById(user_id);

      if (!user) {
        throw new BadRequestException('Usuário não encontrado');
      }
    }
    return await this.participantRepository.find(user_id, trip_id);
  }

  async create(createParticipantDTO: CreateParticipantDTO) {
    const { email, trip_id } = createParticipantDTO;

    const trip = await this.tripRepository.findById(trip_id);

    if (!trip) {
      throw new BadRequestException('Viagem não encontrada');
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Usuário não cadastrado na plataforma');
    }

    const participantExists =
      await this.participantRepository.findParticipantOnTrip(user.id, trip_id);

    if (participantExists) {
      throw new BadRequestException(
        'Participante já convidado para esta viagem',
      );
    }

    return await this.participantRepository.create(
      user.id,
      createParticipantDTO,
    );
  }

  async delete(id: string) {
    const participant = await this.participantRepository.findById(id);

    if (!participant) {
      throw new BadRequestException('Participante não encontrado');
    }

    if (participant.is_owner) {
      throw new BadRequestException(
        'Não é possível remover o proprietário da viagem',
      );
    }

    return await this.participantRepository.delete(id);
  }

  async confirmParticipant(id: string) {
    const participant = await this.participantRepository.findById(id);

    if (!participant) {
      throw new BadRequestException('Participante não encontrado');
    }

    if (participant?.is_confirmed) {
      throw new BadRequestException('Participante já confirmado');
    }

    return await this.participantRepository.confirmParticipant(id);
  }
}
