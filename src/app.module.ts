import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { CryptoassetsModule } from './modules/cryptoassets/cryptoassets.module';
import { SecurityModule } from './modules/security/security.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './modules/users/entities/user.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { Order } from './modules/cryptoassets/entities/order.entity';
import AppDataSource from './typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    UsersModule,
    CryptoassetsModule,
    SecurityModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}
