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
import { TripService } from './trip.service';
import { CreateTripDTO } from './dto/create-trip.dto';
import { UpdateTripDTO } from './dto/update-trip.dto';

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

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTripDTO: UpdateTripDTO) {
    return await this.service.update(id, updateTripDTO);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
