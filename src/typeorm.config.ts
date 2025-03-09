import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Settings } from './model/settings.enum';

config();

const configService = new ConfigService();

const AppDataSource = {
  type: 'postgres',
  host: configService.get<string>(Settings.DATABASE_HOST),
  port: configService.get<number>(Settings.DATABASE_PORT) || 5432,
  username: configService.get<string>(Settings.DATABASE_USER),
  password: configService.get<string>(Settings.DATABASE_PASSWORD),
  database: configService.get<string>(Settings.DATABASE_NAME),
  synchronize: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/**/*.migration{.ts,.js}'],
  migrationsRun: true,
  logging: configService.get<string>(Settings.DATABASE_LOGGING)
};

export default AppDataSource as TypeOrmModuleOptions;