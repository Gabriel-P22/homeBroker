import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { AssetsService } from './assets.service';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { AssetPresenter } from './assets.presenter';
import { AssetDailyService } from './asset-daily.service';
import { AssetDailyPresenter } from './asset-daily.presenter.ts';

@WebSocketGateway({ cors: true })
export class AssetsGateway implements OnGatewayInit {
  logger = new Logger(AssetsGateway.name);

  constructor(
    private assetService: AssetsService,
    private assetsDailyService: AssetDailyService,
  ) { }

  afterInit(server: Server) {
    this.assetService.subscribeNewPriceChangedEvents().subscribe((event) => {
      server
        .to(event.symbol)
        .emit('assets/price-changed', new AssetPresenter(event).toJSON());
    });

    this.assetsDailyService.subscribeCreatedEvents().subscribe((assetDaily) => {
      server
        .to(assetDaily.asset.symbol)
        .emit(
          'assets/daily-created',
          new AssetDailyPresenter(assetDaily).toJSON(),
        );
    });
  }

  @SubscribeMessage('joinAssets')
  handlerjoinAssets(client: any, payload: { symbols: string[] }) {
    if (!payload.symbols?.length) {
      return;
    }

    payload.symbols.forEach((symbol) => client.join(symbol));

    this.logger.log(
      `Client ${client.id} joined asset: ${payload.symbols.join(', ')}`,
    );
  }

  @SubscribeMessage('joinAsset')
  handlerJoinAsset(client: any, payload: { symbol: string }) {
    client.join(payload.symbol);

    this.logger.log(`Client ${client.id} joined asset: ${payload.symbol}`);
  }

  @SubscribeMessage('leaveAssets')
  handlerLeaveAssets(client: any, payload: { symbols: string[] }) {
    if (!payload.symbols?.length) {
      return;
    }

    payload.symbols.forEach((symbol) => client.leave(symbol));

    this.logger.log(
      `Client ${client.id} left asset: ${payload.symbols.join(', ')}`,
    );
  }

  @SubscribeMessage('leaveAsset')
  handlerLeaveAsset(client: any, payload: { symbol: string }) {
    this.logger.log(`Client ${client.id} left asset: ${payload.symbol}`);
  }
}
