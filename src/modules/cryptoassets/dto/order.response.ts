import { Coins } from 'src/model/coins.enum';
import { Order } from '../entities/order.entity';
import { UserResponse } from 'src/modules/users/dtos/user.response';

export class OrderResponse {
  asset: Coins;
  created_at: Date;
  id: string;
  priceEUR: number;
  priceUSD: number;
  quantity: number;
  amountEUR: number;
  amountUSD: number;
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
