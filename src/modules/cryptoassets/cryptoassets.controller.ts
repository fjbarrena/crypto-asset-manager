import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CoingeckoService } from './coingecko.service';
import { Coins } from 'src/model/coins.enum';
import { OrderService } from './order.service';
import { CreateOrderRequest } from './dto/create_order.request';
import { isFailure } from 'src/model/result.model';

@ApiTags('cryptoassets')
@ApiBearerAuth()
@ApiCookieAuth('crypto-cookie')
@Controller('cryptoassets')
export class CryptoassetsController {
  constructor(
    private readonly coinGeckoService: CoingeckoService,
    private readonly orderService: OrderService,
  ) {}

  @Get('/prices/current')
  @ApiOperation({
    summary: 'Gets crypto current prices',
  })
  async getPrices() {
    return this.coinGeckoService.getCurrentCoinsPrice([
      Coins.BITCOIN,
      Coins.ETHEREUM,
      Coins.DOGE,
    ]);
  }

  @Post('/order')
  async createOrder(@Body() order: CreateOrderRequest) {
    const result = await this.orderService.createOrder(order);

    if(isFailure(result)) {
      throw result.failure;
    } else {
      return result.success;
    }
  }
}
