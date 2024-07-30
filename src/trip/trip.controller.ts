import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDTO } from './dto/create-trip.dto';

@Controller('trips')
export class TripController {
  constructor(private readonly service: TripService) {}

  @Get()
  async find(@Query('user_id') user_id: string) {
    return await this.service.find(user_id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Post()
  async create(@Body() createTripDTO: CreateTripDTO) {
    return await this.service.create(createTripDTO);
  }
}
