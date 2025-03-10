import { BaseEntity } from 'src/entities/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Role } from '../enums/role.enum';
import { Order } from 'src/modules/cryptoassets/entities/order.entity';
import { Fiat } from 'src/model/fiat.enum';
import {
  IsAlphanumeric,
  IsArray,
  IsEnum,
  IsNumber,
  Matches,
  MinLength,
} from 'class-validator';

@Entity()
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    unique: true,
  })
  @IsAlphanumeric()
  username: string;

  @Column({
    type: 'varchar',
  })
  @MinLength(10)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: [
      'Passwords will contain at least 1 upper case letter',
      'Passwords will contain at least 1 lower case letter',
      'Passwords will contain at least 1 number or special character',
    ].join('\n'),
  })
  encryptedPassword: string;

  @Column({
    enum: Role,
  })
  @IsEnum(Role)
  role: Role;

  @Column({
    type: 'float',
    default: 0.0,
  })
  @IsNumber()
  balance: number;

  @Column({
    enum: Fiat,
  })
  @IsEnum(Fiat)
  balanceCurrency: Fiat;

  @OneToMany(() => Order, (order) => order.buyer)
  @IsArray()
  orders: Order[];
}
