import { Injectable } from '@nestjs/common';
import { ActivityRepository } from './activity.repository';
import { CreateActivityDTO } from './dto/create-activity.dto';
import { UpdateActivityDTO } from './dto/update-activity.dto';
import { ChangeDoneStatusActivityDTO } from './dto/change-done-status-activity.dto';

@Injectable()
export class ActivityService {
  constructor(private readonly repository: ActivityRepository) {}

  async find(trip_id: string) {
    return await this.repository.find(trip_id);
  }

  async findById(id: string) {
    return await this.repository.findById(id);
  }

  async create(createActivityDTO: CreateActivityDTO) {
    return await this.repository.create(createActivityDTO);
  }

  async update(id: string, updateActivityDTO: UpdateActivityDTO) {
    return await this.repository.update(id, updateActivityDTO);
  }

  async delete(id: string) {
    return await this.repository.delete(id);
  }

  async changeDoneStatus(
    id: string,
    changeDoneStatusActivityDTO: ChangeDoneStatusActivityDTO,
  ) {
    return await this.repository.changeDoneStatus(
      id,
      changeDoneStatusActivityDTO,
    );
  }
}
