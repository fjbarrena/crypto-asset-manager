import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Settings } from '../../model/settings.enum';
import { Coins } from 'src/model/coins.enum';
import axios, { AxiosInstance } from 'axios';
import { CoinsPriceResponse } from './dto/coins_price.response';
import { makeFailure, makeSuccess, Result } from 'src/model/result.model';

@Injectable()
export class CoingeckoService {
  private readonly axiosClient: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>(Settings.COINGECKO_API_KEY);
    const coingeckoBaseUrl = this.configService.get<string>(
      Settings.COINGECKO_API_BASE_URL,
    );

    if (!key) {
      throw new InternalServerErrorException(
        `env variable ${Settings.COINGECKO_API_KEY} is not set`,
      );
    }

    if (!coingeckoBaseUrl) {
      throw new InternalServerErrorException(
        `env variable ${Settings.COINGECKO_API_BASE_URL} is not set`,
      );
    }

    this.axiosClient = axios.create({
      baseURL: coingeckoBaseUrl,
      headers: {
        Accept: 'application/json',
        'x-cg-demo-api-key': key,
      },
    });
  }

  public async getCurrentCoinsPrice(
    coins: Coins[],
  ): Promise<Result<CoinsPriceResponse, HttpException>> {
    try {
      const res = await this.axiosClient.get(
        `/simple/price?ids=${coins.join(',')}&vs_currencies=eur,usd&precision=full`,
      );

      return makeSuccess(res.data as CoinsPriceResponse)
    } catch(e) {
      Logger.error(`Error at getCurrentCoinsPrice with ${coins.join(",")}`)
      return makeFailure(new InternalServerErrorException(e))
    }
  }
}
