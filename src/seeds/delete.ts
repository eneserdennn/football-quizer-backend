import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllPlayers() {
  try {
    // Önce TransferHistory tablosundaki ilgili kayıtları sil
    // await prisma.transferHistory.deleteMany();

    // Sonra Player tablosundaki tüm kayıtları sil
    const deleteResult = await prisma.player.deleteMany();
    console.log(`Deleted ${deleteResult.count} players.`);
  } catch (error) {
    console.error('Error during deletion:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllPlayers();
