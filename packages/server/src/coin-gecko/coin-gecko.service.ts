import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CoinGeckoService {
  constructor(
    private readonly http: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // TODO test this works
  async getDOGUSDPrice() {
    return this.getPriceByContractAddress("0xBAac2B4491727D78D2b78815144570b9f2Fe8899")
  }

  async getPriceByContractAddress(contractAddress: string) {
      const address = contractAddress.toLowerCase()
      const cacheKey = `COINGECKO:${address}`
      const vsCurrency = "usd"
      let usdPrice = await this.cacheManager.get<number>(cacheKey)
      if (usdPrice) {
        return usdPrice
      } else {
        const { data } = await this.http.get(
          `https://api.coingecko.com/api/v3/simple/token_price/ethereum`, {
            params: {
              contract_addresses: address,
              vs_currencies: vsCurrency
            }
          }
        ).toPromise()
        if (!data) {
          throw new Error(`Could not get price for: ${address}`)
        }
        usdPrice = data[address][vsCurrency]
        await this.cacheManager.set(cacheKey, usdPrice, { ttl: 5 * 60 })
        return usdPrice
      }
  }

  async getETHPrice() {
    const cacheKey = "COINGECKO:ETH"
    const vsCurrency = "usd"
    const ethCurrencyId = "ethereum"

    let usdPrice = await this.cacheManager.get<number>(cacheKey)
    if (usdPrice) {
      return usdPrice
    } else {
      const { data } = await this.http.get(
        `https://api.coingecko.com/api/v3/simple/price`, {
          params: {
            ids: ethCurrencyId,
            vs_currencies: vsCurrency
          }
        }
      ).toPromise()
      if (!data) {
        throw new Error(`Could not get price for ETH`)
      }
      usdPrice = data[ethCurrencyId][vsCurrency]
      await this.cacheManager.set(cacheKey, usdPrice, { ttl: 5 * 60 })
      return usdPrice
    }
  }
}
