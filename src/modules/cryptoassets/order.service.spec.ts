import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Order } from './entities/order.entity';
import { ContextIdFactory } from '@nestjs/core';
import { OrderService } from './order.service';
import { CoingeckoService } from './coingecko.service';
import { UserService } from '../users/users.service';
import { MockTypeORM } from 'mock-typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { CreateOrderRequest } from './dto/create_order.request';
import { Coins } from 'src/model/coins.enum';
import { Fiat } from 'src/model/fiat.enum';
import { CoinsPriceResponse } from './dto/coins_price.response';
import { isFailure, isSuccess, Result } from 'src/model/result.model';
import { HttpException } from '@nestjs/common';
import { JwtTokenResponse } from '../security/dtos/jwt-token.response';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    create: jest.fn((item) => item),
  }),
);

export const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(
  () => ({
    createQueryRunner: jest.fn(),
  }),
);

describe('OrderService', () => {
  new MockTypeORM();
  let moduleRef: TestingModule;
  let orderService: OrderService;
  let userService: UserService;
  let coingeckoService: CoingeckoService;
  let datasource: DataSource;
  let orderRepository: Repository<Order>;

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
    orderService = await moduleRef.resolve<OrderService>(
      OrderService,
      contextId,
    );
    userService = await moduleRef.resolve<UserService>(UserService, contextId);
    coingeckoService = await moduleRef.resolve<CoingeckoService>(
      CoingeckoService,
      contextId,
    );
    datasource = await moduleRef.resolve<DataSource>(DataSource, contextId);
    orderRepository = await moduleRef.resolve<Repository<Order>>(
      getRepositoryToken(Order),
      contextId,
    );
  });

  describe('Create a new order', () => {
    it('if all data is correct, creates the order successfully', async () => {
      const mockUser = {
        success: {
          id: '3839a7ec-9526-478c-95ce-596e6b11c638',
          balance: 1000000,
          balanceCurrency: Fiat.EUR,
          username: 'r2d2',
        },
      } as Result<User, HttpException>;

      const mockPrice = {
        success: {
          bitcoin: {
            eur: 100000,
            usd: 100000,
          },
        },
      } as Result<CoinsPriceResponse, HttpException>;

      const mockJwtToken = {
        sub: '3839a7ec-9526-478c-95ce-596e6b11c638',
        username: 'r2d2',
      } as JwtTokenResponse;

      const request = new CreateOrderRequest();
      request.assetToBuy = Coins.BITCOIN;
      request.quantity = 1;
      request.buyerId = mockUser.success!.id;

      jest.spyOn(userService, 'findById').mockResolvedValueOnce(mockUser);

      jest
        .spyOn(coingeckoService, 'getCurrentCoinsPrice')
        .mockResolvedValueOnce(mockPrice);

      jest.spyOn(orderRepository, 'create').mockResolvedValueOnce({
        asset: request.assetToBuy,
        buyer: mockUser.success,
        priceEUR: mockPrice.success![request.assetToBuy]?.eur!,
        priceUSD: mockPrice.success![request.assetToBuy]?.usd!,
        quantity: request.quantity,
      } as never);

      const mockQueryRunner = {
        connect: () => {},
        startTransaction: () => {},
        release: () => {},
        rollbackTransaction: () => {},
        commitTransaction: () => {},
        manager: {
          getRepository: () => {
            return {
              save: (item) => {
                return item;
              },
              update: (item) => {
                return item;
              },
            };
          },
        },
      };

      jest
        .spyOn(datasource, 'createQueryRunner')
        .mockResolvedValue(mockQueryRunner as never);

      const response = await orderService.createOrder(request, mockJwtToken);
      expect(isSuccess(response)).toBeTruthy();
      expect(response.failure).toBeUndefined();
      expect(response.success).not.toBeUndefined();
      expect(response.success?.buyer.id).toBe(mockUser.success!.id);
      expect(response.success?.quantity).toBe(request.quantity);
      expect(response.success?.asset).toBe(request.assetToBuy);
    });
  });

  it('fails if user has not enough funds', async () => {
    const mockUser = {
      success: {
        id: '3839a7ec-9526-478c-95ce-596e6b11c638',
        balance: 10,
        balanceCurrency: Fiat.EUR,
        username: 'r2d2',
      },
    } as Result<User, HttpException>;

    const mockJwtToken = {
      sub: '3839a7ec-9526-478c-95ce-596e6b11c638',
      username: 'r2d2',
    } as JwtTokenResponse;

    const mockPrice = {
      success: {
        bitcoin: {
          eur: 100000,
          usd: 100000,
        },
      },
    } as Result<CoinsPriceResponse, HttpException>;

    const request = new CreateOrderRequest();
    request.assetToBuy = Coins.BITCOIN;
    request.quantity = 1;
    request.buyerId = mockUser.success!.id;

    jest.spyOn(userService, 'findById').mockResolvedValueOnce(mockUser);

    jest
      .spyOn(coingeckoService, 'getCurrentCoinsPrice')
      .mockResolvedValueOnce(mockPrice);

    const response = await orderService.createOrder(request, mockJwtToken);
    expect(isFailure(response)).toBeTruthy();
    expect(response.failure?.name).toBe('PreconditionFailedException');
    expect(response.failure?.message).toContain('funds');
    expect(response.success).toBeUndefined();
  });

  it('fails if quantity is equal or lower than zero', async () => {
    const mockUser = {
      success: {
        id: '3839a7ec-9526-478c-95ce-596e6b11c638',
        balance: 1000000,
        balanceCurrency: Fiat.EUR,
        username: 'r2d2',
      },
    } as Result<User, HttpException>;

    const mockJwtToken = {
      sub: '3839a7ec-9526-478c-95ce-596e6b11c638',
      username: 'r2d2',
    } as JwtTokenResponse;

    const request = new CreateOrderRequest();
    request.assetToBuy = Coins.BITCOIN;
    request.quantity = 0;
    request.buyerId = mockUser.success!.id;

    const response = await orderService.createOrder(request, mockJwtToken);
    expect(isFailure(response)).toBeTruthy();
    expect(response.failure?.name).toBe('BadRequestException');
    expect(response.failure?.message).toContain('zero');
    expect(response.success).toBeUndefined();
  });

  it('fails if quantity is equal or lower than zero', async () => {
    const mockUser = {
      success: {
        id: '3839a7ec-9526-478c-95ce-596e6b11c638',
        balance: 10,
        balanceCurrency: Fiat.EUR,
        username: 'r2d2',
      },
    } as Result<User, HttpException>;

    const mockJwtToken = {
      sub: '3839a7ec-9526-478c-95ce-596e6b11c638',
      username: 'r2d2',
    } as JwtTokenResponse;

    const request = new CreateOrderRequest();
    request.assetToBuy = Coins.BITCOIN;
    request.quantity = 0;
    request.buyerId = mockUser.success!.id;

    const response = await orderService.createOrder(request, mockJwtToken);
    expect(isFailure(response)).toBeTruthy();
    expect(response.failure?.name).toBe('BadRequestException');
    expect(response.failure?.message).toContain('zero');
    expect(response.success).toBeUndefined();
  });
});
