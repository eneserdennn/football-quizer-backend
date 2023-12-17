import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get('random')
  async getRandomPlayer(
    @Query('minMarketValue') minMarketValueString?: string,
    @Query('maxMarketValue') maxMarketValueString?: string,
    @Query('league') league?: string,
  ) {
    const minMarketValue = minMarketValueString
      ? parseFloat(minMarketValueString)
      : undefined;
    const maxMarketValue = maxMarketValueString
      ? parseFloat(maxMarketValueString)
      : undefined;

    // NaN kontrolü ve varsayılan değer ataması
    if (minMarketValueString && isNaN(minMarketValue)) {
      throw new BadRequestException(
        'minMarketValue sayısal bir değer olmalıdır.',
      );
    }
    if (maxMarketValueString && isNaN(maxMarketValue)) {
      throw new BadRequestException(
        'maxMarketValue sayısal bir değer olmalıdır.',
      );
    }

    const player = await this.playersService.findByCriteria(
      minMarketValue,
      maxMarketValue,
      league,
    );

    if (!player) {
      throw new NotFoundException('Oyuncu bulunamadı.');
    }

    return player;
  }

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.create(createPlayerDto);
  }

  @Get()
  findAll() {
    return this.playersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playersService.update(+id, updatePlayerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playersService.remove(+id);
  }
}
