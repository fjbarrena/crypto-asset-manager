import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Order } from './entities/order.entity';
import { ContextIdFactory } from '@nestjs/core';
import { OrderService } from './order.service';
import { CoingeckoService } from './coingecko.service';
import { UserService } from '../users/users.service';
import { MockTypeORM } from 'mock-typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    // ...
  }),
);

// @ts-ignore
export const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(
  () => ({
    createQueryRunner: jest.fn(),
  }),
);

describe('OrderService', () => {
  new MockTypeORM();
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(async () => ({
          COINGECKO_API_KEY: 'mocked',
          COINGECKO_API_BASE_URL: 'https://api.coingecko.com/api/v3',
        })),
      ],
      providers: [
        OrderService,
        CoingeckoService,
        UserService,
        { provide: DataSource, useFactory: dataSourceMockFactory },
        {
          provide: getRepositoryToken(Order),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
  });

  beforeEach(async () => {
    jest.resetAllMocks();

    const contextId = ContextIdFactory.create();
    moduleRef.registerRequestByContextId({}, contextId);
  });

  describe('Create a new order', () => {
    it('if all data is correct, creates the order successfully', async () => {});
  });
});
