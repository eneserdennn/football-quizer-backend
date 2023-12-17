-- CreateTable
CREATE TABLE "League" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "totalMarketValue" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "averageMarketValue" DOUBLE PRECISION NOT NULL,
    "averageAge" DOUBLE PRECISION NOT NULL,
    "totalMarketValue" DOUBLE PRECISION NOT NULL,
    "leagueId" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "shirtNumber" INTEGER,
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "birthCountry" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "height" DOUBLE PRECISION,
    "playerTeamId" INTEGER NOT NULL,
    "image_url" TEXT,
    "full_name" TEXT,
    "foot" TEXT,
    "position" TEXT,
    "market_value" DOUBLE PRECISION,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_playerTeamId_fkey" FOREIGN KEY ("playerTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
