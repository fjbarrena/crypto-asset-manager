import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Settings } from '../../model/settings.enum';
import { Coins } from 'src/model/coins.enum';
import axios, { AxiosInstance } from 'axios';
import { CoinsPriceResponse } from './dto/coins_price.response';

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
  ): Promise<CoinsPriceResponse> {
    const res = await this.axiosClient.get(
      `/simple/price?ids=${coins.join(',')}&vs_currencies=eur,usd&precision=full`,
    );

    return res.data as CoinsPriceResponse;
  }
}
