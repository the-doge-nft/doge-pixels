import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from './../cache/cache.service';

@Injectable()
export class CoinGeckoService {
  private logger = new Logger(CoinGeckoService.name);
  private secondsToCache = 5 * 60;
  private DOGContractAddress = '0xBAac2B4491727D78D2b78815144570b9f2Fe8899';

  constructor(
    private readonly http: HttpService,
    private readonly cache: CacheService,
  ) {}

  // TODO test this works
  async getDOGUSDPrice() {
    return this.getPriceByEthereumContractAddress(this.DOGContractAddress);
  }

  async getPriceByEthereumContractAddress(
    contractAddress: string,
  ): Promise<number> {
    const address = contractAddress.toLowerCase();
    const vsCurrency = 'usd';

    return this.cache.getOrQueryAndCache<number>(
      `COINGECKO:${address}`,
      async () => {
        const { data } = await this.http
          .get(`https://api.coingecko.com/api/v3/simple/token_price/ethereum`, {
            params: {
              contract_addresses: address,
              vs_currencies: vsCurrency,
            },
          })
          .toPromise();

        if (!data || !data?.[address]?.[vsCurrency]) {
          this.logger.error(
            `could not get coingecko price: ${address}:${vsCurrency}`,
          );
          throw new Error(`Could not get price for: ${address}`);
        }
        return data[address][vsCurrency];
      },
      this.secondsToCache,
    );
  }

  private async getPriceVsUsd(currencyId: string) {
    const usdCurrencyId = 'usd';
    return this.cache.getOrQueryAndCache<number>(
      `COINGECKO:${currencyId}`,
      async () => {
        const { data } = await this.http
          .get(`https://api.coingecko.com/api/v3/simple/price`, {
            params: {
              ids: currencyId,
              vs_currencies: usdCurrencyId,
            },
          })
          .toPromise();
        if (!data || !data?.[currencyId]?.[usdCurrencyId]) {
          this.logger.error(
            `could not get coingecko price: ${currencyId}:${usdCurrencyId}`,
          );
          throw new Error(`Could not get price for ${currencyId}`);
        }
        return data[currencyId][usdCurrencyId];
      },
      this.secondsToCache,
    );
  }

  async getETHPrice() {
    return this.getPriceVsUsd('ethereum');
  }

  async getDogePrice() {
    return this.getPriceVsUsd('dogecoin');
  }
}
