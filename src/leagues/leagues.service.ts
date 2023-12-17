import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LeaguesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.league.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} league`;
  }

  findOneByName(name: string) {
    return this.prisma.league.findFirst({
      where: {
        name,
      },
    });
  }
}
