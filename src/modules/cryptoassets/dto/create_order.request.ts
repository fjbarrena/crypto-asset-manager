import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsPositive, IsUUID } from 'class-validator';
import { Coins } from 'src/model/coins.enum';

export class CreateOrderRequest {
  @ApiProperty({
    description: 'Asset to buy',
  })
  @IsEnum(Coins)
  assetToBuy: Coins;

  @ApiProperty({
    description: 'Plain password (will be encrypted on the database)',
  })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    description: 'UserId which will buy it',
  })
  @IsUUID()
  buyerId: string;
}
