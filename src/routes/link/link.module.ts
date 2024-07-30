import { Module } from '@nestjs/common';
import { LinkController } from './link.controller';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { LinkService } from './link.service';
import { LinkRepository } from './link.repository';

@Module({
  controllers: [LinkController],
  providers: [PrismaService, LinkService, LinkRepository],
})
export class LinkModule {}
