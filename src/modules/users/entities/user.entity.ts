import { BaseEntity } from 'src/entities/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Role } from '../enums/role.enum';
import { Order } from 'src/modules/cryptoassets/entities/order.entity';

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
    type: "money"
  })
  balance: number;

  @OneToMany(() => Order, order => order.buyer)
  orders: Order[]
}
