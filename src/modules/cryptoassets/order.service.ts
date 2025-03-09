import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, PreconditionFailedException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderRequest } from './dto/create_order.request';
import { CoingeckoService } from './coingecko.service';
import { UserService } from '../users/users.service';
import { isSuccess, makeFailure, makeSuccess, Result } from 'src/model/result.model';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
    private readonly coinGeckoService: CoingeckoService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
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

    // Take users currency
    const amount = request.quantity * price[request.assetToBuy]![user.balanceCurrency]!

    if(user.balance < amount) {
      return makeFailure(new PreconditionFailedException("User does not have enough funds"))
    }
    
    const dirtyOrder = this.repository.create({
          asset: request.assetToBuy,
          buyer: user,
          priceEUR: price[request.assetToBuy]?.eur!,
          priceUSD: price[request.assetToBuy]?.usd!,
          quantity: request.quantity
        });
    
    const newBalance = user.balance - amount

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect();
    await queryRunner.startTransaction()

    try {
      const order = await queryRunner.manager.getRepository(Order).save(dirtyOrder);
      await queryRunner.manager.getRepository(User).update({id: user.id}, {balance: newBalance});
      await queryRunner.commitTransaction();

      return makeSuccess(order);
    } catch (ex) {
      Logger.error("Error updating users balance. Rollback", ex);
      await queryRunner.rollbackTransaction();
      return makeFailure(new InternalServerErrorException('Error updating users balance. Rollback'))
    } finally {
      await queryRunner.release();
    }
  }
}
