import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { JwtModule } from '@nestjs/jwt';
import JwtConfiguration from 'src/security.config';

@Module({
  imports: [
    UsersModule,
    JwtModule.register(JwtConfiguration),
  ],
  providers: [SecurityService],
  controllers: [SecurityController],
})
export class SecurityModule {}
