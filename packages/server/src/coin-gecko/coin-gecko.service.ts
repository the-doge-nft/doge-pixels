import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';

@Injectable()
export class CoinGeckoService {
  constructor(
    private readonly http: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getDOGUSDPrice() {
    const cacheKey = 'COINGECKO:DOG';
    const dogID = 'the-doge-nft';
    const vsCurrency = 'usd';
    let usdPrice = await this.cacheManager.get(cacheKey);
    if (!usdPrice) {
      const { data } = await this.http
        .get('https://api.coingecko.com/api/v3/simple/price', {
          params: {
            ids: dogID,
            vs_currencies: vsCurrency,
          },
          headers: {
            accept: 'application/json',
          },
        })
        .toPromise();
      if (!data) {
        throw new Error('Could not get DOG price');
      }
      usdPrice = Number(data[dogID][vsCurrency]);
      await this.cacheManager.set(cacheKey, usdPrice, { ttl: 3 * 60 });
      return usdPrice;
    } else {
      return usdPrice;
    }
  }
}
