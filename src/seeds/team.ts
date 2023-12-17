import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { TeamsService } from '../teams/teams.service';

async function processLeague(
  teamsService: TeamsService,
  leagueId: number,
  leagueName: string,
) {
  return new Promise<void>((resolve) => {
    const results = [];
    fs.createReadStream(`data/${leagueName}.csv`)
      .pipe(csv())
      .on('data', (data) => {
        results.push({ ...data, leagueId });
      })
      .on('end', async () => {
        for (const team of results) {
          const existingTeam = await teamsService.findOneByName(team.Club);
          if (existingTeam) {
            const updateTeamData = {
              id: existingTeam.id, // existingTeam'in id'sini ekleyin
              name: team.Club,
              averageMarketValue:
                parseFloat(
                  team['Average Market Value']
                    .replace('€', '')
                    .replace('m', ''),
                ) * 1000000,
              averageAge: parseFloat(team['Average Age']),
              totalMarketValue:
                parseFloat(
                  team['Total Market Value'].replace('€', '').replace('m', ''),
                ) * 1000000,
              leagueId: leagueId,
            };
            await teamsService.update(updateTeamData.id, updateTeamData);
          } else {
            const createTeamData = {
              name: team.Club,
              averageMarketValue:
                parseFloat(
                  team['Average Market Value']
                    .replace('€', '')
                    .replace('m', ''),
                ) * 1000000,
              averageAge: parseFloat(team['Average Age']),
              totalMarketValue:
                parseFloat(
                  team['Total Market Value'].replace('€', '').replace('m', ''),
                ) * 1000000,
              leagueId: leagueId,
            };
            await teamsService.create(createTeamData);
          }
        }
        resolve();
      });
  });
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const teamsService = app.get(TeamsService);

  const leagues = {
    1: 'LaLiga',
    2: 'PremierLeague',
    3: 'Bundesliga',
    4: 'SerieA',
    5: 'Ligue1',
  };

  for (const leagueId in leagues) {
    await processLeague(teamsService, parseInt(leagueId), leagues[leagueId]);
  }

  await app.close();
}

bootstrap();
