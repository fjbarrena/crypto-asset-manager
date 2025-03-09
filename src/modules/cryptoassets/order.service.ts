import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderRequest } from './dto/create_order.request';
import { CoingeckoService } from './coingecko.service';
import { UserService } from '../users/users.service';

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

  async createOrder(request: CreateOrderRequest) {
    if(request.quantity <= 0) {
      throw new BadRequestException("Quantity must be greater than zero")
    }

    const user = await this.userService.findById(request.buyerId);

    if(!user) {
      throw new BadRequestException("BuyerId does not exist")
    }

    const price = await this.coinGeckoService.getCurrentCoinsPrice([request.assetToBuy])

    if(!price) {
      throw new BadRequestException("Specified asset to buy does not exist")
    }


    
  }
}
