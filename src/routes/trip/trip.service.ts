import { BadRequestException, Injectable } from '@nestjs/common';
import { TripRepository } from './trip.repository';
import { CreateTripDTO } from './dto/create-trip.dto';
import { UpdateTripDTO } from './dto/update-trip.dto';
import dayjs from '../../lib/dayjs';
import { UserRepository } from '../user/user.repository';
import { ParticipantRepository } from '../participant/participant.repository';

@Injectable()
export class TripService {
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly userRepository: UserRepository,
    private readonly participantRepository: ParticipantRepository,
  ) {}

  async find(userId: string) {
    return await this.tripRepository.find(userId);
  }

  async findById(id: string) {
    const trip = await this.tripRepository.findById(id);

    if (!trip) {
      throw new BadRequestException('Viagem não encontrada.');
    }

    return trip;
  }

  async create(createTripDTO: CreateTripDTO) {
    const { user_id, emails_to_invite, ends_at, starts_at } = createTripDTO;

    const user = this.findById(user_id);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado.');
    }

    if (dayjs(starts_at).isBefore(dayjs(), 'day')) {
      throw new BadRequestException(
        'A data de início deve ser maior ou igual à data atual.',
      );
    }

    if (dayjs(ends_at).isBefore(starts_at)) {
      throw new BadRequestException(
        'A data de término deve ser maior que a data de início.',
      );
    }

    const participants = (
      await Promise.all(
        emails_to_invite.map(async (email) => {
          const invitedUser = await this.userRepository.findByEmail(email);
          if (invitedUser) {
            return {
              user_id: invitedUser.id,
              is_owner: false,
              is_confirmed: false,
            };
          }
        }),
      )
    ).filter(Boolean) as Array<{
      user_id: string;
      is_owner: boolean;
      is_confirmed: boolean;
    }>;

    participants.push({
      user_id,
      is_owner: true,
      is_confirmed: true,
    });

    return await this.tripRepository.create(createTripDTO, participants);
  }

  async update(id: string, updateTripDTO: UpdateTripDTO) {
    const { ends_at, starts_at } = updateTripDTO;

    const trip = await this.tripRepository.findById(id);

    if (!trip) {
      throw new BadRequestException('Viagem não encontrada.');
    }

    if (dayjs(starts_at).isBefore(dayjs(trip.starts_at), 'day')) {
      throw new BadRequestException(
        'A data de inicio deve ser maior que a data inicial de inicio da viagem.',
      );
    }
    if (dayjs(ends_at).isBefore(trip.starts_at)) {
      throw new BadRequestException(
        'A data de término deve ser maior que a data de inicio.',
      );
    }

    const startsAtISO = dayjs(starts_at).toISOString();

    const conflictingActivitiesStartsAt =
      await this.tripRepository.findConflictingActivitiesStartsAt(
        id,
        startsAtISO,
      );

    if (conflictingActivitiesStartsAt.length > 0) {
      const hasConflictingActivities = conflictingActivitiesStartsAt.some(
        (activity) => {
          return (
            dayjs(activity.occurs_at).isSame(dayjs(starts_at), 'day') &&
            dayjs(activity.occurs_at).isBefore(dayjs(starts_at))
          );
        },
      );

      if (hasConflictingActivities) {
        throw new BadRequestException(
          'Existem atividades com a data de ocorrência menor que a data de início da viagem.',
        );
      }
    }

    const endsAtISO = dayjs(ends_at).toISOString();

    const conflictingActivitiesEndsAT =
      await this.tripRepository.findConflictingActivitiesEndsAt(id, endsAtISO);

    if (conflictingActivitiesEndsAT.length > 0) {
      throw new BadRequestException(
        'Existem atividades com a data de ocorrência maior que a data de término da viagem.',
      );
    }

    updateTripDTO.ends_at = endsAtISO;
    updateTripDTO.starts_at = startsAtISO;

    this.tripRepository.update(id, updateTripDTO);
  }

  async delete(id: string) {
    const trip = await this.tripRepository.findById(id);

    if (!trip) {
      throw new BadRequestException('Viagem não encontrada.');
    }

    const participants =
      await this.participantRepository.findConfirmedParticipantsNotOwner(id);

    if (participants.length > 0) {
      throw new BadRequestException(
        'Não é possível remover uma viagem com participantes confirmados',
      );
    }

    return await this.tripRepository.delete(id);
  }
}
