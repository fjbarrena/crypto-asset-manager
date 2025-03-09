import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Settings } from '../../model/settings.enum';
import { Coins } from 'src/model/coins.enum';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class CoingeckoService {
  private readonly axiosClient: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>(Settings.COINGECKO_API_KEY);

    if (!key) {
      throw new InternalServerErrorException(
        `env variable ${Settings.COINGECKO_API_KEY} is not set`,
      );
    }

    this.axiosClient = axios.create({
      baseURL: 'https://api.coingecko.com/api/v3',
      headers: {
        Accept: 'application/json',
        'x-cg-demo-api-key': key,
      },
    });
  }

  public async getCurrentCoinsPrice(coins: Coins[]): Promise<any> {
    const res = await this.axiosClient.get(
      `/simple/price?ids=${coins.join(',')}&vs_currencies=eur,usd`,
    );
    return res.data;
  }
}
