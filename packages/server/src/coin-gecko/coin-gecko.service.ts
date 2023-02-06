import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { CacheService } from './../cache/cache.service';

@Injectable()
export class CoinGeckoService {
  private logger = new Logger(CoinGeckoService.name);
  private secondsToCache = 10 * 60;
  private DOGContractAddress =
    '0xBAac2B4491727D78D2b78815144570b9f2Fe8899'.toLowerCase();
  private ETHEREUM_API_ID = 'ethereum';
  private DOGECOIN_API_ID = 'dogecoin';

  private getPriceCacheKey(addressOrId: string) {
    return `COINGECKO:${addressOrId}`;
  }

  constructor(
    private readonly http: HttpService,
    private readonly cache: CacheService,
  ) {}

  async getPricesByEthereumContractAddresses(address: string[]) {
    const vsCurrency = 'usd';
    const addressesLower = address.map((addr) => addr.toLowerCase());
    const data = await this.getSimplePriceByAddress(addressesLower, vsCurrency);
    const prices = {};
    Object.keys(data).forEach((key) => (prices[key] = data[key][vsCurrency]));
    return prices;
  }

  async getPriceByEthereumContractAddress(address: string) {
    const vsCurrency = 'usd';
    const addressLower = address.toLowerCase();
    const data = await this.getSimplePriceByAddress(addressLower, vsCurrency);
    return data[addressLower][vsCurrency];
  }

  async getDogPrice() {
    return this.getPriceByEthereumContractAddress(this.DOGContractAddress);
  }

  async getDogePrice() {
    return this.getPriceVsUsd(this.DOGECOIN_API_ID);
  }

  getCachedPrice(addressOrCurrencyId: string) {
    return this.cache.get<number>(
      this.getPriceCacheKey(addressOrCurrencyId.toLowerCase()),
    );
  }

  getCachedEthPrice() {
    return this.getCachedPrice(this.ETHEREUM_API_ID);
  }

  getCachedDogePrice() {
    return this.getCachedPrice(this.DOGECOIN_API_ID);
  }

  getCachedDogPrice() {
    return this.getCachedPrice(this.DOGContractAddress);
  }

  async refreshPricesByEthereumContractAddresses(addresses: string[]) {
    const lowerAddresses = addresses.map((addr) => addr.toLowerCase());
    const prices = await this.getPricesByEthereumContractAddresses(
      lowerAddresses,
    );
    for (const address of Object.keys(prices)) {
      const price = prices[address];
      await this.cache.set(
        this.getPriceCacheKey(address),
        price,
        this.secondsToCache,
      );
    }
    return prices;
  }

  refreshEthPrice() {
    return this.refreshCacheBySymbol(this.ETHEREUM_API_ID);
  }

  refreshDogePrice() {
    return this.refreshCacheBySymbol(this.DOGECOIN_API_ID);
  }

  refreshDogPrice() {
    return this.refreshCacheByAddress(this.DOGContractAddress);
  }

  private async refreshCacheBySymbol(symbol: string) {
    const price = await this.getPriceVsUsd(symbol);
    await this.cache.set(
      this.getPriceCacheKey(symbol),
      price,
      this.secondsToCache,
    );
    return price;
  }

  private async refreshCacheByAddress(address: string) {
    const addressLower = address.toLowerCase();
    const price = await this.getPriceByEthereumContractAddress(addressLower);
    await this.cache.set(
      this.getPriceCacheKey(addressLower),
      price,
      this.secondsToCache,
    );
    return price;
  }

  private async getSimplePriceByAddress(
    contractAddress: string | string[],
    vsCurrency = 'usd',
  ): Promise<number> {
    // this.logger.log(`querying coingecko: ${contractAddress}`);
    const address = Array.isArray(contractAddress)
      ? contractAddress.join(',')
      : contractAddress.toLowerCase();
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
            this.logger.error(`could not get coingecko price: ${address}`);
            throw new Error(`Could not get price for: ${address}`);
          }),
        ),
    );
    if (!data) {
      this.logger.error(`could not get coingecko price: ${address}`);
      throw new Error(`Could not get price for: ${address}`);
    }
    return data;
  }

  private async getPriceVsUsd(currencyId: string) {
    // this.logger.log(`querying coingecko: ${currencyId}`);
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
}
