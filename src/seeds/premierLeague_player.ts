import { PrismaClient } from '@prisma/client';
import * as csv from 'csv-parser';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function findTeamIdByName(teamName) {
  let teamNameRecalculated = teamName;

  switch (teamName) {
    case 'Sheff Utd':
      teamNameRecalculated = 'Sheffield United';
      break;
    case 'Man City':
      teamNameRecalculated = 'Manchester City';
      break;
    case 'Man Utd':
      teamNameRecalculated = 'Manchester United';
      break;
    case 'Nottm Forest':
      teamNameRecalculated = 'Nottingham Forest';
      break;
    case 'Wolves':
      teamNameRecalculated = 'Wolverhampton Wanderers';
      break;
    case 'Barcelona':
      teamNameRecalculated = 'FC Barcelona';
      break;
    case 'Athletic':
      teamNameRecalculated = 'Athletic Bilbao';
      break;
    case 'Getafe':
      teamNameRecalculated = 'Getafe CF';
      break;
    case 'Valencia':
      teamNameRecalculated = 'Valencia CF';
      break;
    case 'Atlético Madrid':
      teamNameRecalculated = 'Atlético de Madrid';
      break;
    case 'Villarreal':
      teamNameRecalculated = 'Villarreal CF';
      break;
    case 'Girona':
      teamNameRecalculated = 'Girona FC';
      break;
    case 'Alavés':
      teamNameRecalculated = 'Deportivo Alavés';
      break;
    case 'Real Betis':
      teamNameRecalculated = 'Real Betis Balompié';
      break;
    case 'Monza':
      teamNameRecalculated = 'AC Monza';
      break;
    case 'Torino':
      teamNameRecalculated = 'Torino FC';
      break;
    case 'Juventus':
      teamNameRecalculated = 'Juventus FC';
      break;
    case 'Lazio':
      teamNameRecalculated = 'SS Lazio';
      break;
    case 'Lecce':
      teamNameRecalculated = 'US Lecce';
      break;
    case 'Genoa':
      teamNameRecalculated = 'Genoa CFC';
      break;
    case 'Sassuolo':
      teamNameRecalculated = 'US Sassuolo';
      break;
    case 'Bologna':
      teamNameRecalculated = 'Bologna FC 1909';
      break;
    case 'Frosinone':
      teamNameRecalculated = 'Frosinone Calcio';
      break;
    case 'Inter':
      teamNameRecalculated = 'Inter Milan';
      break;
    case 'Salernitana':
      teamNameRecalculated = 'US Salernitana 1919';
      break;
    case 'Fiorentina':
      teamNameRecalculated = 'ACF Fiorentina';
      break;
    case 'Werder Bremen':
      teamNameRecalculated = 'SV Werder Bremen';
      break;
    case 'E. Frankfurt':
      teamNameRecalculated = 'Eintracht Frankfurt';
      break;
    case 'TSG Hoffenheim':
      teamNameRecalculated = 'TSG 1899 Hoffenheim';
      break;
    case 'Bor. Dortmund':
      teamNameRecalculated = 'Borussia Dortmund';
      break;
    case 'Union Berlin':
      teamNameRecalculated = '1.FC Union Berlin';
      break;
    case 'B. Leverkusen':
      teamNameRecalculated = 'Bayer 04 Leverkusen';
      break;
    case "Bor. M'gladbach":
      teamNameRecalculated = 'Borussia Mönchengladbach';
      break;
    case 'Heidenheim':
      teamNameRecalculated = '1.FC Heidenheim 1846';
      break;
    case 'Monaco':
      teamNameRecalculated = 'AS Monaco';
      break;
    case 'Stade Brestois':
      teamNameRecalculated = 'Stade Brestois 29';
      break;
    case 'R. Strasbourg':
      teamNameRecalculated = 'RC Strasbourg Alsace';
      break;
    case 'Marseille':
      teamNameRecalculated = 'Olympique Marseille';
      break;
    case 'Toulouse':
      teamNameRecalculated = 'FC Toulouse';
      break;
    case 'Stade Rennais':
      teamNameRecalculated = 'Stade Rennais FC';
      break;
    case 'Clermont Foot':
      teamNameRecalculated = 'Clermont Foot 63';
      break;
    case 'Montpellier':
      teamNameRecalculated = 'Montpellier HSC';
      break;
    case 'Paris SG':
      teamNameRecalculated = 'Paris Saint-Germain';
      break;
    case 'Lens':
      teamNameRecalculated = 'RC Lens';
      break;
  }

  const team = await prisma.team.findFirst({
    where: {
      name: {
        contains: teamNameRecalculated,
        mode: 'insensitive', // Büyük/küçük harfe duyarlılığı kaldırır
      },
    },
  });
  return team.id;
}

// async function createTransferHistory(playerId, transfer) {
//   const fromTeamId = await findTeamIdByName(transfer.old_club).catch(
//     () => null,
//   );
//   const toTeamId = await findTeamIdByName(transfer.new_club).catch(() => null);
//
//   let feeValue = null;
//   let isLoanTransfer = false; // Kiralama transferi bayrağı
//
//   if (typeof transfer.fee === 'number') {
//     feeValue = transfer.fee;
//   } else if (transfer.fee === 'loan transfer') {
//     feeValue = 0;
//     isLoanTransfer = true; // Kiralama transferi olarak işaretle
//   } else if (transfer.fee === 'free transfer') {
//     feeValue = 0;
//   }
//
//   await prisma.transferHistory
//     .create({
//       data: {
//         player_id: playerId,
//         date: new Date(transfer.date),
//         season: transfer.season,
//         from_team_id: fromTeamId,
//         to_team_id: toTeamId,
//         fee: feeValue,
//         transfer_market_value: transfer.transfer_market_value || null,
//         isLoan: isLoanTransfer, // Kiralama transferi bilgisini ekle
//       },
//     })
//     .catch((e) => {
//       console.log(
//         `Transfer history creation failed for player ${playerId}: `,
//         e,
//       );
//     });
// }

async function importPlayers() {
  const results = [];

  fs.createReadStream('data/ligue_1_players.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for (const player of results) {
        try {
          const teamId = await findTeamIdByName(player.current_club_name);
          const playerData = {
            shirtNumber: player.shirt_number
              ? parseInt(player.shirt_number, 10)
              : null,
            name: player.name,
            dateOfBirth: new Date(player.date_of_birth),
            birthCountry: player.birth_place,
            nationality: player.nationality,
            height: player.height ? parseFloat(player.height) : null,
            playerTeamId: teamId,
            image_url: player.image_url || null,
            full_name: player.full_name_in_home_country || null,
            foot: player.foot || null,
            position: player.position || null,
            market_value: player.market_value
              ? parseFloat(player.market_value)
              : null,
          };

          await prisma.player.create({ data: playerData });
        } catch (error) {
          console.error(`Oyuncu oluşturma hatası: ${player.name}`, error);
        }
        // const playerRecord = await prisma.player.findFirst({
        //   where: {
        //     name: {
        //       contains: player.name,
        //     },
        //   },
        // });
        //
        // const teamId = await findTeamIdByName(player.current_club_name);
        //
        // if (!playerRecord) {
        //   await prisma.player.create({
        //     data: {
        //       shirtNumber: player.shirt_number
        //         ? parseInt(player.shirt_number, 10)
        //         : null,
        //       name: player.name,
        //       dateOfBirth: new Date(player.date_of_birth),
        //       birthCountry: player.birth_place,
        //       nationality: player.nationality,
        //       height: player.height ? parseFloat(player.height) : null,
        //       // Eğer teamId varsa, Team ile ilişkilendir
        //       playerTeam: teamId ? { connect: { id: teamId } } : undefined,
        //       image_url: player.image_url || null,
        //       full_name: player.full_name_in_home_country || null,
        //       foot: player.foot || null,
        //       position: player.position || null,
        //       market_value: player.market_value
        //         ? parseFloat(player.market_value)
        //         : null,
        //       // Diğer alanlar
        //     },
        //   });
        // }
        // try {
        //   // Tek tırnakları çift tırnakla ve Python None'ları null ile değiştir
        //   let formattedHistory = player.transfer_history.replace(/'/g, '"');
        //   formattedHistory = formattedHistory.replace(/None/g, 'null');
        //
        //   const transferHistoryData = JSON.parse(formattedHistory);
        //
        //   // Transfer geçmişini işle
        //   for (const transfer of transferHistoryData) {
        //     await createTransferHistory(playerRecord.id, transfer);
        //   }
        // } catch (e) {
        //   console.error(`JSON parse error for player ${player.name}: `, e);
        // }
      }
    });
}

importPlayers()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
