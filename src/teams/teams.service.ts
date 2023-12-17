import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(@Body() createTeamDto: CreateTeamDto) {
    return this.prisma.team.create({
      data: createTeamDto,
    });
  }

  async findAll() {
    return this.prisma.team.findMany({
      include: {
        league: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.team.findUnique({
      where: { id },
    });
  }

  async findOneByName(name: string) {
    try {
      const team = await this.prisma.team.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive',
          },
        },
      });

      if (!team) {
        console.log('Team not found');
      }

      return team;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    return this.prisma.team.update({
      where: { id },
      data: updateTeamDto,
    });
  }

  async remove(id: number) {
    return this.prisma.team.delete({
      where: { id },
    });
  }
}
