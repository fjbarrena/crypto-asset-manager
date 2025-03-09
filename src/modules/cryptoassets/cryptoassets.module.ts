import { Module } from '@nestjs/common';
import { CoingeckoService } from './coingecko.service';
import { ConfigService } from '@nestjs/config';
import { CryptoassetsController } from './cryptoassets.controller';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), UsersModule],
  providers: [CoingeckoService, ConfigService, OrderService],
  controllers: [CryptoassetsController],
})
export class CryptoassetsModule {}
