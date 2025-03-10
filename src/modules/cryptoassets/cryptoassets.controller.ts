import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CoingeckoService } from './coingecko.service';
import { Coins } from 'src/model/coins.enum';
import { OrderService } from './order.service';
import { CreateOrderRequest } from './dto/create_order.request';
import { isSuccess } from 'src/model/result.model';
import { OrderResponse } from './dto/order.response';
import { CoinsPriceResponse } from './dto/coins_price.response';
import { JwtGuard } from '../security/guards/jwt.guard';
import { JwtToken } from 'src/decorators/jwt-token.decorator';
import { JwtTokenResponse } from '../security/dtos/jwt-token.response';

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

  @Post('/order')
  @ApiOperation({
    summary: 'Creates a buy order',
  })
  @ApiResponse({
    status: 201,
    description: `Order created successfully`,
    type: OrderResponse,
  })
  @ApiResponse({
    status: 400,
    description: `Bad request`,
  })
  @ApiResponse({
    status: 401,
    description: `Unauthorized`,
  })
  @ApiResponse({
    status: 412,
    description: `Precondition failed (user does not have enough funds)`,
  })
  async createOrder(
    @Body() order: CreateOrderRequest,
    @JwtToken() token: JwtTokenResponse,
  ): Promise<OrderResponse> {
    const result = await this.orderService.createOrder(order, token);

    if (isSuccess(result)) {
      return result.success;
    } else {
      throw result.failure;
    }
  }
}
