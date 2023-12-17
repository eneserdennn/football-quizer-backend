import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  averageMarketValue: number;

  @IsNumber()
  averageAge: number;

  @IsNumber()
  totalMarketValue: number;

  @IsNumber()
  @IsNotEmpty()
  leagueId: number;
}
