import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { CreateActivityDTO } from './dto/create-activity.dto';

@ApiTags('Activities')
@Controller('activities')
export class ActivityController {
  constructor(private readonly service: ActivityService) {}

  @Get()
  @ApiQuery({ name: 'trip_id', required: false })
  async find(@Query('trip_id') trip_id: string) {
    return await this.service.find(trip_id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Post()
  async create(@Body() createActivityDTO: CreateActivityDTO) {
    return await this.service.create(createActivityDTO);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateActivityDTO: CreateActivityDTO,
  ) {
    return await this.service.update(id, updateActivityDTO);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
