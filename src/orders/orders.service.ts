import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderSchema: Model<Order>,
  ) { }

  create(createOrderDto: CreateOrderDto) {
    return this.orderSchema.create({
      wallet: createOrderDto.walletId,
      asset: createOrderDto.assetId,
      shares: createOrderDto.shares,
      partial: createOrderDto.shares,
      type: createOrderDto.type,
      status: OrderStatus.PENDING,
    });
  }

  findAll(filter: { walletId: string }) {
    return this.orderSchema.find({ wallet: filter.walletId });
    // .populate(['asset', 'trade']);
  }

  findOne(id: string) {
    return this.orderSchema.findById(id);
    // .populate(['asset', 'trade']);
  }

  createTrade() { }
}
