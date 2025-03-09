import { BaseEntity } from 'src/entities/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Role } from '../enums/role.enum';
import { Order } from 'src/modules/cryptoassets/entities/order.entity';
import { Fiat } from 'src/model/fiat.enum';

@Entity()
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
  })
  encryptedPassword: string;

  @Column({
    enum: Role,
  })
  role: Role;

  @Column({
    type: 'float',
    default: 0.0,
  })
  balance: number;

  @Column({
    enum: Fiat,
  })
  balanceCurrency: Fiat;

  @OneToMany(() => Order, (order) => order.buyer)
  orders: Order[];
}
