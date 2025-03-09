import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Settings } from './model/settings.enum';
import { JwtModuleOptions } from '@nestjs/jwt';

config();

const configService = new ConfigService();

const JwtConfiguration = {
    global: true,
    secret: configService.get<string>(Settings.JWT_SECRET),
    signOptions: {
      expiresIn: configService.get<string>(Settings.JWT_EXPIRES_IN),
      issuer: configService.get<string>(Settings.JWT_ISSUER),
    }
}

export default JwtConfiguration as JwtModuleOptions;
