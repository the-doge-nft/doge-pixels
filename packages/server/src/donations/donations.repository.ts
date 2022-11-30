import { Injectable, Logger } from '@nestjs/common';
import { ChainName, Donations, Prisma } from '@prisma/client';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { CoinGeckoService } from '../coin-gecko/coin-gecko.service';
import { EthersService } from '../ethers/ethers.service';
import { MydogeService } from './../mydoge/mydoge.service';
import { PrismaService } from './../prisma.service';
import { SochainService } from './../sochain/sochain.service';
import { UnstoppableDomainsService } from './../unstoppable-domains/unstoppable-domains.service';

export const DOGE_CURRENCY_SYMBOL = 'DOGE';
export const ETH_CURRENCY_SYMBOL = 'ETH';

@Injectable()
export class DonationsRepository {
  private logger = new Logger(DonationsRepository.name);
  blackListedContractAddresses = [
    '0xb187916e2e927f3bb27035689bc93ebb910af279',
    '0xdf781bba6f9eefb1a74bb39f6df5e282c5976636',
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly coingecko: CoinGeckoService,
    private readonly sochain: SochainService,
    private readonly ethers: EthersService,
    private readonly mydoge: MydogeService,
    private readonly ud: UnstoppableDomainsService,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  private async afterGetDonations(donations: Donations[]) {
    const data: (Donations & {
      currencyUSDNotional: number;
      explorerUrl: string;
      fromEns: string | null;
      fromMyDogeName: string | null;
      fromUD: string | null;
    })[] = [];
    for (const donation of donations) {
      // skip past any blacklisted addresses
      if (
        this.blackListedContractAddresses.includes(
          donation.currencyContractAddress,
        )
      ) {
        continue;
      }

      let fromMyDogeName = null;
      let fromEns = null;
      let donatedCurrencyPrice: number;
      let fromUD = null;
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
        this.logger.error(e);
        this.logger.error(`Could not get currency price: ${donation.currency}`);
      }

      if (donation.blockchain === ChainName.ETHEREUM) {
        try {
          fromEns = await this.ethers.getEnsName(donation.fromAddress);
        } catch (e) {
          this.logger.error(
            `Could not get donation ENS for: ${donation.fromAddress}`,
          );
        }

        try {
          fromUD = await this.ud.getUDName(donation.fromAddress);
        } catch (e) {
          this.logger.error(
            `Could not get donation UD for: ${donation.fromAddress}`,
          );
        }
      }

      const currencyUSDNotional = donatedCurrencyPrice * donation.amount;

      data.push({
        ...donation,
        currencyUSDNotional,
        explorerUrl,
        fromEns,
        fromMyDogeName,
        fromUD,
      });
    }
    return data;
  }

  upsert(donation: Prisma.DonationsCreateInput) {
    return this.prisma.donations.upsert({
      where: { txHash: donation.txHash },
      update: {
        ...donation,
      },
      create: {
        ...donation,
      },
    });
  }

  async findMany(args: Prisma.DonationsFindManyArgs) {
    const donations = await this.prisma.donations.findMany(args);
    return this.afterGetDonations(donations);
  }

  async getMostRecentDogeDonationForAddress(toAddress: string) {
    return (
      await this.prisma.donations.findMany({
        where: {
          blockchain: ChainName.DOGECOIN,
          currency: DOGE_CURRENCY_SYMBOL,
          toAddress,
        },
        orderBy: { blockCreatedAt: 'desc' },
      })
    )?.[0];
  }

  async getMostRecentEthereumDonation() {
    return (
      await this.prisma.donations.findMany({
        where: {
          AND: {
            blockchain: ChainName.ETHEREUM,
            currencyContractAddress: {
              notIn: this.blackListedContractAddresses,
            },
          },
        },
        orderBy: { blockCreatedAt: 'desc' },
      })
    )?.[0];
  }
}
