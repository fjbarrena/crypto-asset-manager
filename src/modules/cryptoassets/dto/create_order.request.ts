import { ApiProperty } from '@nestjs/swagger';
import { Coins } from 'src/model/coins.enum';

export class CreateOrderRequest {
  @ApiProperty({
    description: 'Asset to buy',
  })
  assetToBuy: Coins;

  @ApiProperty({
    description: 'Plain password (will be encrypted on the database)',
  })
  quantity: number;

  @ApiProperty({
    description: "UserId which will buy it"
  })
  buyerId: string
}
