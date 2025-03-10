import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsPositive, IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';
import { Coins } from 'src/model/coins.enum';

export class CreateOrderRequest {
  @ApiProperty({
    description: 'Asset to buy',
    enum: Coins,
  })
  @IsEnum(Coins)
  assetToBuy: Coins;

  @ApiProperty({
    description: 'Quantity of assets to buy',
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    description: 'UserId which will buy the asset. Only admins can buy assets in name of other users',
    example: randomUUID()
  })
  @IsUUID()
  buyerId: string;
}
