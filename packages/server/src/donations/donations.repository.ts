import { Injectable, Logger } from '@nestjs/common';
import { ChainName, Donations, Prisma } from '@prisma/client';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { CoinGeckoService } from '../coin-gecko/coin-gecko.service';
import { CacheService } from './../cache/cache.service';
import { PrismaService } from './../prisma.service';
import { SochainService } from './../sochain/sochain.service';

export const DOGE_CURRENCY = 'DOGE';
export const ETH_CURRENCY = 'ETH';

@Injectable()
export class DonationsRepository {
  private logger = new Logger(DonationsRepository.name);

  private usdNotionalCacheKey = 'DONATIONS:USD';

  constructor(
    private readonly prisma: PrismaService,
    private readonly coingecko: CoinGeckoService,
    private readonly sochain: SochainService,
    private readonly cache: CacheService,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  private async afterGetDonations(donations: Donations[]) {
    const data: (Donations & {
      currencyUSDNotional: number;
      explorerUrl: string;
    })[] = [];
    let totalUSDDonations = 0;
    for (const donation of donations) {
      let donatedCurrencyPrice: number;
      let explorerUrl: string;
      try {
        if (donation.currency === DOGE_CURRENCY) {
          donatedCurrencyPrice = await this.coingecko.getDogePrice();
          explorerUrl = this.sochain.getTxExplorerUrl(donation.txHash);
        } else {
          explorerUrl = `https://etherscan.io/tx/${donation.txHash}`;
          if (donation.currencyContractAddress) {
            donatedCurrencyPrice =
              await this.coingecko.getPriceByEthereumContractAddress(
                donation.currencyContractAddress,
              );
          } else if (donation.currency === ETH_CURRENCY) {
            donatedCurrencyPrice = await this.coingecko.getETHPrice();
          } else {
            donatedCurrencyPrice = 0;
            const errorMessage = `No currency address for: ${donation.currency} :: ${donation.txHash}`;
            this.logger.error(errorMessage);
            this.sentryClient.instance().captureMessage(errorMessage);
          }
        }
      } catch (e) {
        donatedCurrencyPrice = 0;
        this.logger.error('Could not get currency price');
      }

      const currencyUSDNotional = donatedCurrencyPrice * donation.amount;
      totalUSDDonations += currencyUSDNotional;
      data.push({ ...donation, currencyUSDNotional, explorerUrl });
    }
    // set cache on demand
    await this.cache.set(this.usdNotionalCacheKey, totalUSDDonations, 60 * 2);
    return data;
  }

  upsert(donation: Prisma.DonationsCreateInput) {
    return this.prisma.donations.upsert({
      where: { txHash: donation.txHash },
      update: {},
      create: {
        ...donation,
      },
    });
  }

  findMany(args: Prisma.DonationsFindManyArgs) {
    return this.prisma.donations.findMany(args);
  }

  async getMostRecentDogeDonation() {
    return (
      await this.prisma.donations.findMany({
        where: {
          blockchain: ChainName.DOGECOIN,
          currency: DOGE_CURRENCY,
        },
        orderBy: { blockCreatedAt: 'desc' },
      })
    )?.[0];
  }

  async getMostRecentEthereumDonation() {
    return (
      await this.prisma.donations.findMany({
        where: {
          blockchain: ChainName.ETHEREUM,
        },
        orderBy: { blockCreatedAt: 'desc' },
      })
    )?.[0];
  }

  async getMostRecentDonations() {
    const donations = await this.prisma.donations.findMany({
      orderBy: {
        blockCreatedAt: 'desc',
      },
    });
    return this.afterGetDonations(donations);
  }

  async getUSDNotionalDonated() {
    return this.cache.get(this.usdNotionalCacheKey);
  }
}
