import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

config();

const configService = new ConfigService();

const AppDataSource = {
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: 5432,
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  synchronize: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/**/*.migration{.ts,.js}'],
  migrationsRun: true,
  logging: true
};

export default AppDataSource as TypeOrmModuleOptions;