import { BaseEntity } from 'src/entities/base.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Coins } from 'src/model/coins.enum';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class Order extends BaseEntity {
  @Column({
    type: 'enum',
    enum: Coins,
    enumName: "Coins",
  })
  asset: Coins;

  @Column({
    type: 'integer',
    unsigned: true
  })
  quantity: number;

  @Column({
    type: 'money',
    unsigned: true
  })
  priceUSD: number;

  @Column({
    type: 'money',
    unsigned: true
  })
  priceEUR: number;

  @ManyToOne(() => User, user => user.id)
  buyer: User
}
