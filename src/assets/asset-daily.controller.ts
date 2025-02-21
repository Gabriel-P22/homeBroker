import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AssetDailyService } from './asset-daily.service';

@Controller('assets/:symbol/dailies')
export class AssetDailyController {
  constructor(private readonly assetDailyService: AssetDailyService) { }

  @Get()
  findAll(@Param('symbol') symbol: string) {
    return this.assetDailyService.findAll(symbol);
  }

  @Post()
  create(
    @Body() dto: { date: string; price: number },
    @Param('symbol') symbol: string,
  ) {
    return this.assetDailyService.create({
      symbol,
      date: new Date(dto.date),
      price: dto.price,
    });
  }
}
