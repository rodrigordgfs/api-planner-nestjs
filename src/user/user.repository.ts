import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async find(email?: string) {
    return await this.prisma.user.findMany({
      where: {
        email,
      },
    });
  }
}
