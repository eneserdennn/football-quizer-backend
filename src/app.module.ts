import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeaguesModule } from './leagues/leagues.module';
import { PrismaService } from './prisma.service';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [LeaguesModule, TeamsModule, PlayersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
