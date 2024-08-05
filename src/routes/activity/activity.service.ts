import { BadRequestException, Injectable } from '@nestjs/common';
import { ActivityRepository } from './activity.repository';
import { CreateActivityDTO } from './dto/create-activity.dto';
import { UpdateActivityDTO } from './dto/update-activity.dto';
import { ChangeDoneStatusActivityDTO } from './dto/change-done-status-activity.dto';
import { TripRepository } from '../trip/trip.repository';
import { groupBy } from 'lodash';
import dayjs from '../../lib/dayjs';

@Injectable()
export class ActivityService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly tripRepository: TripRepository,
  ) {}

  async find(trip_id: string) {
    const trip = await this.tripRepository.findByIdWithActivities(trip_id);

    if (!trip) {
      throw new BadRequestException('Viagem não encontrada');
    }

    const generateDateRange = (start: string, end: string) => {
      const startDate = dayjs(start);
      const endDate = dayjs(end);
      const dateRange = [];
      let currentDate = startDate;

      while (
        currentDate.isBefore(endDate) ||
        currentDate.isSame(endDate, 'day')
      ) {
        dateRange.push(currentDate.format('YYYY-MM-DD'));
        currentDate = currentDate.add(1, 'day');
      }

      return dateRange;
    };

    const dateRange = generateDateRange(
      trip.starts_at.toString(),
      trip.ends_at.toString(),
    );

    const groupedActivities = groupBy(trip.activities, (activity) =>
      dayjs(activity.occurs_at).format('YYYY-MM-DD'),
    );

    const activitiesByDay = dateRange.reduce(
      (acc, date) => {
        acc[date] = groupedActivities[date] || [];
        return acc;
      },
      {} as Record<string, any[]>,
    );

    return activitiesByDay;
  }

  async findById(id: string) {
    const activity = await this.activityRepository.findById(id);

    if (!activity) {
      throw new BadRequestException('Atividade não encontrada');
    }

    return activity;
  }

  async create(createActivityDTO: CreateActivityDTO) {
    const { occurs_at, trip_id } = createActivityDTO;

    const trip = await this.tripRepository.findById(trip_id);

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

    createActivityDTO.occurs_at = occursAtUtc.toISOString();

    return await this.activityRepository.create(createActivityDTO);
  }

  async update(id: string, updateActivityDTO: UpdateActivityDTO) {
    const { occurs_at } = updateActivityDTO;

    const activity = await this.activityRepository.findById(id);

    if (!activity) {
      throw new BadRequestException('Atividade não encontrada');
    }

    const trip = await this.tripRepository.findById(activity.trip_id);

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

    return await this.activityRepository.update(id, updateActivityDTO);
  }

  async delete(id: string) {
    const activity = await this.activityRepository.findById(id);

    if (!activity) {
      throw new BadRequestException('Atividade não encontrada');
    }

    return await this.activityRepository.delete(id);
  }

  async changeDoneStatus(
    id: string,
    changeDoneStatusActivityDTO: ChangeDoneStatusActivityDTO,
  ) {
    const activity = await this.activityRepository.findById(id);

    if (!activity) {
      throw new BadRequestException('Atividade não encontrada');
    }

    return await this.activityRepository.changeDoneStatus(
      id,
      changeDoneStatusActivityDTO,
    );
  }
}
