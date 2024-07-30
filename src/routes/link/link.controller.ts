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
import { LinkService } from './link.service';
import { CreateLinkDTO } from './dto/create-link.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Links')
@Controller('links')
export class LinkController {
  constructor(private readonly service: LinkService) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Get()
  @ApiQuery({ name: 'trip_id', required: false })
  async find(@Query('trip_id') trip_id: string) {
    return await this.service.find(trip_id);
  }

  @Post()
  async create(@Body() createLinkDTO: CreateLinkDTO) {
    return await this.service.create(createLinkDTO);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateLinkDTO: CreateLinkDTO) {
    return await this.service.update(id, updateLinkDTO);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
