import { Coins } from 'src/model/coins.enum';
import { Order } from '../entities/order.entity';
import { UserResponse } from 'src/modules/users/dtos/user.response';
import { ApiProperty } from '@nestjs/swagger';

export class OrderResponse {
  @ApiProperty({
    enum: Coins,
  })
  asset: Coins;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  id: string;

  @ApiProperty()
  priceEUR: number;

  @ApiProperty()
  priceUSD: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  amountEUR: number;

  @ApiProperty()
  amountUSD: number;

  @ApiProperty({
    type: UserResponse,
  })
  buyer: UserResponse;

  public static fromEntity(order: Order): OrderResponse {
    const response = new OrderResponse();

    response.asset = order.asset;
    response.created_at = order.created_at;
    response.id = order.id;
    response.priceEUR = order.priceEUR;
    response.priceUSD = order.priceUSD;
    response.quantity = order.quantity;
    response.amountEUR = order.priceEUR * order.quantity;
    response.amountUSD = order.priceUSD * order.quantity;
    response.buyer = UserResponse.fromEntity(order.buyer);

    return response;
  }
}
