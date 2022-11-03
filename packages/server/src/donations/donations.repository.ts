import { Injectable, Logger } from '@nestjs/common';
import { ChainName, Donations, Prisma } from '@prisma/client';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { CoinGeckoService } from '../coin-gecko/coin-gecko.service';
import { EthersService } from '../ethers/ethers.service';
import { MydogeService } from './../mydoge/mydoge.service';
import { PrismaService } from './../prisma.service';
import { SochainService } from './../sochain/sochain.service';

export const DOGE_CURRENCY_SYMBOL = 'DOGE';
export const ETH_CURRENCY_SYMBOL = 'ETH';

@Injectable()
export class DonationsRepository {
  private logger = new Logger(DonationsRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly coingecko: CoinGeckoService,
    private readonly sochain: SochainService,
    private readonly ethers: EthersService,
    private readonly mydoge: MydogeService,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  private async afterGetDonations(donations: Donations[]) {
    const data: (Donations & {
      currencyUSDNotional: number;
      explorerUrl: string;
      fromEns: string | null;
      fromMyDogeName: string | null;
    })[] = [];
    for (const donation of donations) {
      let fromMyDogeName = null;
      let fromEns = null;
      let donatedCurrencyPrice: number;
      let explorerUrl: string;
      try {
        if (donation.currency === DOGE_CURRENCY_SYMBOL) {
          donatedCurrencyPrice = await this.coingecko.getDogePrice();
          explorerUrl = this.sochain.getTxExplorerUrl(donation.txHash);
          try {
            fromMyDogeName = await this.mydoge.getWalletProfile(
              donation.fromAddress,
            );
          } catch (e) {}
        } else {
          explorerUrl = `https://etherscan.io/tx/${donation.txHash}`;
          if (donation.currencyContractAddress) {
            donatedCurrencyPrice =
              await this.coingecko.getPriceByEthereumContractAddress(
                donation.currencyContractAddress,
              );
          } else if (donation.currency === ETH_CURRENCY_SYMBOL) {
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

      if (
        donation.blockchain === ChainName.ETHEREUM &&
        currencyUSDNotional > 0.1
      ) {
        try {
          fromEns = await this.ethers.getEnsName(donation.fromAddress);
        } catch (e) {
          this.logger.error(
            `Could not get donation ENS for: ${donation.fromAddress}`,
          );
        }
      }

      data.push({
        ...donation,
        currencyUSDNotional,
        explorerUrl,
        fromEns,
        fromMyDogeName,
      });
    }
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
          currency: DOGE_CURRENCY_SYMBOL,
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
}
