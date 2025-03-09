import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
import { OrderResponse } from './dto/order.response';
import { CoinsPriceResponse } from './dto/coins_price.response';
import { JwtGuard } from '../security/guards/jwt.guard';

@ApiTags('cryptoassets')
@ApiBearerAuth()
@ApiCookieAuth('crypto-cookie')
@Controller('cryptoassets')
@UseGuards(JwtGuard)
export class CryptoassetsController {
  constructor(
    private readonly coinGeckoService: CoingeckoService,
    private readonly orderService: OrderService,
  ) {}

  @Get('/prices/current')
  @ApiOperation({
    summary: 'Gets all crypto current prices',
  })
  async getPrices(): Promise<CoinsPriceResponse> {
    return this.coinGeckoService.getCurrentCoinsPrice([
      Coins.BITCOIN,
      Coins.ETHEREUM,
      Coins.DOGE,
    ]);
  }

  @Post('/order')
  async createOrder(@Body() order: CreateOrderRequest): Promise<OrderResponse> {
    const result = await this.orderService.createOrder(order);

    if (isFailure(result)) {
      throw result.failure;
    } else {
      return result.success;
    }
  }
}
