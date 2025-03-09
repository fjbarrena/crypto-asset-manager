import { BadRequestException, HttpException, Injectable, PreconditionFailedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderRequest } from './dto/create_order.request';
import { CoingeckoService } from './coingecko.service';
import { UserService } from '../users/users.service';
import { makeFailure, makeSuccess, Result } from 'src/model/result.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
    private readonly coinGeckoService: CoingeckoService,
    private readonly userService: UserService,
  ) {}

  async getAll(): Promise<Order[]> {
    return this.repository.find();
  }

  async createOrder(request: CreateOrderRequest): Promise<Result<Order, HttpException>> {
    if(request.quantity <= 0) {
      return makeFailure(new BadRequestException("Quantity must be greater than zero"))
    }

    const user = await this.userService.findById(request.buyerId);

    if(!user) {
      return makeFailure(new BadRequestException("BuyerId does not exist"))
    }

    const price = await this.coinGeckoService.getCurrentCoinsPrice([request.assetToBuy])

    if(!price) {
      return makeFailure(new BadRequestException("Specified asset to buy does not exist"))
    }

    const amount = request.quantity * price[request.assetToBuy]?.usd!

    if(user.balance < amount) {
      return makeFailure(new PreconditionFailedException("User does not have enough funds"))
    }

    this.repository.create()
    

    const dirtyOrder = this.repository.create({
          asset: request.assetToBuy,
          buyer: user,
          priceEUR: price[request.assetToBuy]?.eur!,
          priceUSD: price[request.assetToBuy]?.usd!,
          quantity: request.quantity
        });
    
    const order = await this.repository.save(dirtyOrder);

    return makeSuccess(order)
  }
}
