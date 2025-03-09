export class CoinsPriceResponse {
  bitcoin?: Price;
  ethereum?: Price;
  doge?: Price;
}

class Price {
  eur: number;
  usd: number;
}
