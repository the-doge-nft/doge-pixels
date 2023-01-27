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

export interface DonationsAfterGet extends Donations {
  currencyUSDNotional: number;
  explorerUrl: string;
  fromEns: string | null;
  fromMyDogeName: string | null;
  fromUD: string | null;
}

@Injectable()
export class DonationsRepository {
  private logger = new Logger(DonationsRepository.name);
  blackListedContractAddresses = [
    '0xb187916e2e927f3bb27035689bc93ebb910af279',
    '0xdf781bba6f9eefb1a74bb39f6df5e282c5976636',
    '0x643695D282f6BA237afe27FFE0Acd89a86b50d3e',
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

  private async afterGetDonations(
    donations: Donations[],
  ): Promise<DonationsAfterGet[]> {
    const data: DonationsAfterGet[] = [];
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
      let donatedCurrencyPrice = 0;
      let fromUD = null;
      let explorerUrl: string;

      const isDoge = donation.currency === DOGE_CURRENCY_SYMBOL;
      if (isDoge) {
        explorerUrl = this.sochain.getTxExplorerUrl(donation.txHash);

        donatedCurrencyPrice = await this.coingecko.getCachedPrice('dogecoin');
        fromMyDogeName = await this.mydoge.getCachedName(donation.fromAddress);
      } else {
        explorerUrl = `https://etherscan.io/tx/${donation.txHash}`;

        if (donation.currency === ETH_CURRENCY_SYMBOL) {
          donatedCurrencyPrice = await this.coingecko.getCachedPrice(
            'ethereum',
          );
        } else if (donation.currencyContractAddress) {
          donatedCurrencyPrice = await this.coingecko.getCachedPrice(
            donation.currencyContractAddress,
          );
        }
      }

      if (donation.blockchain === ChainName.ETHEREUM) {
        fromEns = await this.ethers.getCachedEnsName(donation.fromAddress);
        fromUD = await this.ud.getCachedName(donation.fromAddress);
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

  async findManyNoAfters(args: Prisma.DonationsFindManyArgs) {
    return this.prisma.donations.findMany(args);
  }

  async findMany(
    args: Prisma.DonationsFindManyArgs,
  ): Promise<DonationsAfterGet[]> {
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
