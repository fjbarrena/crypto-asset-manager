import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'ONMYSECRET',
      signOptions: {
        expiresIn: '60s',
        issuer: 'crypto-asset-manager-issuer',
      },
    }),
  ],
  providers: [SecurityService],
  controllers: [SecurityController],
})
export class SecurityModule {}
