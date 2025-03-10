import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  PreconditionFailedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderRequest } from './dto/create_order.request';
import { CoingeckoService } from './coingecko.service';
import { UserService } from '../users/users.service';
import { isFailure, makeFailure, makeSuccess, Result } from 'src/model/result.model';
import { User } from '../users/entities/user.entity';
import { OrderResponse } from './dto/order.response';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
    private readonly coinGeckoService: CoingeckoService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  /*
    NOTE: this order creation may have race conditions between the orders table and the balance on user's
    table. For example, we may have a race condition which allows a user to buy assets without enough
    funds in his balance.
    
    This is how I will solve it:
      1.- I'll add a new table "OrdersDailyMovements"
      2.- Every new order will create a row in that table with the order information (asset, quantity, etc.)
      3.- The validation of user's funds (balance) will be against User table, but instead of checking it 
          directly (user.balance > amount), it will retrieve first all the orders done by the user that day
          on OrdersDailyMovements, and substract the amount of money spent that day. If the balance stills be
          positive, the operation would be approved and the order will be created. If not, the order will fail
          with a Out of Funds message
      4.- In that way, is not possible to have a race condition, because we are not writing and reading, we are just
          writing a "log of orders", and checking that all the orders are consistent with the business rules on every
          new order
      5.- Every night, we will have a consolidation process, which processes all the orders for every user and updates
          the balance accordingly
      6.- If a new order is created in the middle of that process, nothing bad happens. Those orders will be stored in
          "OrdersDailyMovements", as the orders created the previous day, and processed the next day. In the case an order
          was created while the consolidation process is running, we are still able to know if the user have funds, we just
          need to get the balance of the user, retrieve all the orders attached to that user on "OrdersDailyMovements", 
          process them and substract the amounts from the user's balance, and check if there is enough money for the order.
      7.- Finally, the consolidation process is a good place as well to check AGAIN that the business rules are being met.
          Imagine we got a race condition, even in that conditions. At the end of the day we can re-check again that the balance
          of the user is enough, and deny operations if it happens.
    
    I didn't implemented it as I guess it's out of scope for this challenge ;)
  */
  async createOrder(
    request: CreateOrderRequest,
  ): Promise<Result<OrderResponse, HttpException>> {
    if (request.quantity <= 0) {
      return makeFailure(
        new BadRequestException('Quantity must be greater than zero'),
      );
    }

    const user = await this.userService.findById(request.buyerId);

    if (isFailure(user)) {
      return makeFailure(new BadRequestException('BuyerId does not exist'));
    }

    const price = await this.coinGeckoService.getCurrentCoinsPrice([
      request.assetToBuy,
    ]);

    if (!price) {
      return makeFailure(
        new BadRequestException('Specified asset to buy does not exist'),
      );
    }

    // Take users currency
    const amount =
      request.quantity * price[request.assetToBuy]![user.success.balanceCurrency];

    if (user.success.balance < amount) {
      return makeFailure(
        new PreconditionFailedException('User does not have enough funds'),
      );
    }

    const dirtyOrder = await this.repository.create({
      asset: request.assetToBuy,
      buyer: user.success,
      priceEUR: price[request.assetToBuy]?.eur!,
      priceUSD: price[request.assetToBuy]?.usd!,
      quantity: request.quantity,
    });

    const newBalance = user.success.balance - amount;

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager
        .getRepository(Order)
        .save(dirtyOrder);
      await queryRunner.manager
        .getRepository(User)
        .update({ id: user.success!.id }, { balance: newBalance });
      await queryRunner.commitTransaction();
      return makeSuccess(OrderResponse.fromEntity(order));
    } catch (ex) {
      Logger.error('Error updating users balance. Rollback', ex);
      await queryRunner.rollbackTransaction();
      return makeFailure(
        new InternalServerErrorException(
          'Error updating users balance. Rollback',
        ),
      );
    } finally {
      await queryRunner.release();
    }
  }
}
