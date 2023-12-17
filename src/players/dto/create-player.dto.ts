import {
  IsInt,
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
  IsUrl,
} from 'class-validator';

export class CreatePlayerDto {
  @IsOptional()
  @IsInt()
  shirtNumber?: number;

  @IsString()
  name: string;

  @IsDate()
  dateOfBirth: Date;

  @IsString()
  birthCountry: string;

  @IsString()
  nationality: string;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsInt()
  playerTeamId: number;

  @IsOptional()
  @IsUrl()
  image_url?: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  foot?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsNumber()
  market_value?: number;
}
