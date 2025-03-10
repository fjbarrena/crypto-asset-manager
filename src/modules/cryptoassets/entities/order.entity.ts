import { BaseEntity } from 'src/entities/base.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Coins } from 'src/model/coins.enum';
import { User } from 'src/modules/users/entities/user.entity';
import {
  IsArray,
  IsCurrency,
  IsEnum,
  IsNumber,
  IsPositive,
} from 'class-validator';

@Entity()
export class Order extends BaseEntity {
  @Column({
    type: 'enum',
    enum: Coins,
    enumName: 'Coins',
  })
  @IsEnum(Coins)
  asset: Coins;

  @Column({
    type: 'integer',
    unsigned: true,
  })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @Column({
    type: 'float',
    unsigned: true,
  })
  @IsNumber()
  @IsPositive()
  priceUSD: number;

  @Column({
    type: 'float',
    unsigned: true,
  })
  @IsNumber()
  @IsPositive()
  priceEUR: number;

  @ManyToOne(() => User, (user) => user.id)
  @IsArray()
  buyer: User;
}
