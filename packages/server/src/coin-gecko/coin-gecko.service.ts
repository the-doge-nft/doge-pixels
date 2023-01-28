import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { CacheService } from './../cache/cache.service';

@Injectable()
export class CoinGeckoService {
  private logger = new Logger(CoinGeckoService.name);
  private secondsToCache = 5 * 60;
  private DOGContractAddress = '0xBAac2B4491727D78D2b78815144570b9f2Fe8899';

  static getPriceCacheKey(address: string) {
    return `COINGECKO:${address}`;
  }

  constructor(
    private readonly http: HttpService,
    private readonly cache: CacheService,
  ) {}

  async getPriceByEthereumContractAddress(
    contractAddress: string,
  ): Promise<number> {
    this.logger.log(`querying coingecko: ${contractAddress}`);
    const address = contractAddress.toLowerCase();
    const vsCurrency = 'usd';

    const { data } = await firstValueFrom(
      this.http
        .get(`https://api.coingecko.com/api/v3/simple/token_price/ethereum`, {
          params: {
            contract_addresses: address,
            vs_currencies: vsCurrency,
          },
        })
        .pipe(
          catchError((e) => {
            this.logger.error(
              `could not get coingecko price: ${address}:${vsCurrency}`,
            );
            throw new Error(`Could not get price for: ${address}`);
          }),
        ),
    );
    if (!data || !data?.[address]?.[vsCurrency]) {
      this.logger.error(
        `could not get coingecko price: ${address}:${vsCurrency}`,
      );
      throw new Error(`Could not get price for: ${address}`);
    }
    return data[address][vsCurrency];
  }

  private async getPriceVsUsd(currencyId: string) {
    this.logger.log(`querying coingecko: ${currencyId}`);
    const usdCurrencyId = 'usd';

    const { data } = await firstValueFrom(
      this.http
        .get(`https://api.coingecko.com/api/v3/simple/price`, {
          params: {
            ids: currencyId,
            vs_currencies: usdCurrencyId,
          },
        })
        .pipe(
          catchError((e) => {
            this.logger.error(e);
            throw new Error(`Could not get price for ${currencyId}`);
          }),
        ),
    );
    if (!data || !data?.[currencyId]?.[usdCurrencyId]) {
      this.logger.error(
        `could not get coingecko price: ${currencyId}:${usdCurrencyId}`,
      );
      throw new Error(`Could not get price for ${currencyId}`);
    }
    return data[currencyId][usdCurrencyId];
  }

  async getDOGUSDPrice() {
    return this.getPriceByEthereumContractAddress(this.DOGContractAddress);
  }

  async getETHPrice() {
    return this.getPriceVsUsd('ethereum');
  }

  async getDogePrice() {
    return this.getPriceVsUsd('dogecoin');
  }

  getCachedPrice(addressOrCurrencyId: string) {
    return this.cache.get<number>(
      CoinGeckoService.getPriceCacheKey(addressOrCurrencyId),
    );
  }

  getCachedEthPrice() {
    return this.getCachedPrice('ethereum');
  }

  getCachedDogePrice() {
    return this.getCachedPrice('dogecoin');
  }

  async refreshCachedPriceByAddress(address: string) {
    await this.cache.set(
      CoinGeckoService.getPriceCacheKey(address),
      await this.getPriceByEthereumContractAddress(address),
      this.secondsToCache,
    );
  }

  async refreshCachedPriceBySymbol(symbol: string) {
    await this.cache.set(
      CoinGeckoService.getPriceCacheKey(symbol),
      await this.getPriceVsUsd(symbol),
      this.secondsToCache,
    );
  }

  async refreshEthPrice() {
    const id = 'ethereum';
    await this.cache.set(
      CoinGeckoService.getPriceCacheKey(id),
      await this.getPriceVsUsd(id),
      this.secondsToCache,
    );
  }

  async refreshDogePrice() {
    const id = 'dogecoin';
    await this.cache.set(
      CoinGeckoService.getPriceCacheKey(id),
      await this.getPriceVsUsd(id),
      this.secondsToCache,
    );
  }
}
