import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async findByCriteria(
    minMarketValue?: number,
    maxMarketValue?: number,
    league?: string,
  ) {
    const whereClause: any = {};

    if (minMarketValue !== undefined) {
      whereClause.market_value = {
        ...whereClause.market_value,
        gte: minMarketValue,
      };
    }
    if (maxMarketValue !== undefined) {
      whereClause.market_value = {
        ...whereClause.market_value,
        lte: maxMarketValue,
      };
    }
    if (league) {
      whereClause.playerTeam = {
        league: {
          name: {
            contains: league,
            mode: 'insensitive',
          },
        },
      };
    }

    // Uygun oyuncuların sayısını bulun
    const count = await this.prisma.player.count({ where: whereClause });

    if (count === 0) {
      return null;
    }

    // Rastgele bir indeks seçin
    const randomIndex = Math.floor(Math.random() * count);

    // Bu indeksteki oyuncuyu getirin
    const players = await this.prisma.player.findMany({
      where: whereClause,
      take: 1,
      skip: randomIndex,
      include: {
        playerTeam: { include: { league: true } },
      },
    });

    return { message: 'message', randomPlayer: players[0] };
  }

  async create(createPlayerDto: CreatePlayerDto) {
    try {
      return await this.prisma.player.create({
        data: createPlayerDto,
      });
    } catch (error) {
      throw new Error('Oyuncu oluşturulamadı');
    }
  }

  async findAll() {
    try {
      const players = await this.prisma.player.findMany({
        include: {
          playerTeam: { include: { league: true } },
        },
      });

      return { message: 'message', players: players };
    } catch (error) {
      throw new Error('Oyuncular getirilemedi');
    }
  }

  async findOne(id: number) {
    try {
      const player = await this.prisma.player.findUnique({
        where: { id },
      });

      if (!player) {
        throw new NotFoundException(`Oyuncu bulunamadı: #${id}`);
      }

      return player;
    } catch (error) {
      throw new Error(`Oyuncu bulunamadı: #${id}`);
    }
  }

  async update(id: number, updatePlayerDto: any) {
    try {
      return await this.prisma.player.update({
        where: { id },
        data: updatePlayerDto,
      });
    } catch (error) {
      throw new Error(`Oyuncu güncellenemedi: #${id}`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.player.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Oyuncu silinemedi: #${id}`);
    }
  }
}
