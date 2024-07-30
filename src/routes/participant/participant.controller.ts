import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ParticipantService } from './participant.service';
import { CreateParticipantDTO } from './dto/create-participant.dto';

@ApiTags('Participants')
@Controller('participants')
export class ParticipantController {
  constructor(private readonly service: ParticipantService) {}

  @Get()
  @ApiQuery({ name: 'user_id', required: false })
  @ApiQuery({ name: 'trip_id', required: false })
  async find(
    @Query('user_id') user_id: string,
    @Query('trip_id') trip_id: string,
  ) {
    return await this.service.find(user_id, trip_id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Post()
  async create(@Body() createParticipantDTO: CreateParticipantDTO) {
    return await this.service.create(createParticipantDTO);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }

  @Patch(':id/confirm')
  async confirmParticipant(@Param('id') id: string) {
    return await this.service.confirmParticipant(id);
  }
}
