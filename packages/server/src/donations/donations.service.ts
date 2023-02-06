import { Injectable, Logger } from '@nestjs/common';
import { ChainName, Donations, Prisma } from '@prisma/client';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { AssetTransfersWithMetadataResult } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { AlchemyService } from '../alchemy/alchemy.service';
import { CoinGeckoService } from '../coin-gecko/coin-gecko.service';
import { EthersService } from '../ethers/ethers.service';
import { sleepAndTryAgain } from '../helpers/sleep';
import { MydogeService } from '../mydoge/mydoge.service';
import { PrismaService } from '../prisma.service';
import { UnstoppableDomainsService } from '../unstoppable-domains/unstoppable-domains.service';
import {
  SochainService,
  Transaction,
  TxReceived,
} from './../sochain/sochain.service';

export interface Balance {
  symbol: string;
  amount: number;
  usdNotional: number;
  usdPrice: number;
}

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
export class DonationsService {
  private logger = new Logger(DonationsService.name);
  myDogeAddress = 'D8HjKf37rF3Ho7tjwe17MPN8xQ2UbHSUhB';
  soDogeTipAddress = 'D7XihpaUjiCqvPrky2xEyfvgoJeUjMKQ6E';
  ethereumAddress = '0x633aC73fB70247257E0c3A1142278235aFa358ac';

  blackListedContractAddresses = [
    '0xb187916e2e927f3bb27035689bc93ebb910af279',
    '0xdf781bba6f9eefb1a74bb39f6df5e282c5976636',
    '0x643695D282f6BA237afe27FFE0Acd89a86b50d3e',
  ];

  constructor(
    private readonly alchemy: AlchemyService,
    private readonly sochain: SochainService,
    private readonly prisma: PrismaService,
    private readonly coingecko: CoinGeckoService,
    private readonly ethers: EthersService,
    private readonly mydoge: MydogeService,
    private readonly ud: UnstoppableDomainsService,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  async upsertDogeDonations(receivedTxs: TxReceived[], toAddress: string) {
    for (const receivedTx of receivedTxs) {
      try {
        const tx: Transaction = await sleepAndTryAgain(
          () => this.sochain.getTransaction(receivedTx.txid),
          2,
        );
        if (tx.block_no === null) {
          this.logger.log(
            `block not confirmed yet, skipping DOGE tx sync: ${tx.txid}`,
          );
          continue;
        }
        const fromAddress = tx.inputs[0].address;
        await this.upsert({
          fromAddress,
          toAddress,
          blockNumber: tx.block_no,
          blockCreatedAt: new Date(receivedTx.time * 1000),
          blockchain: ChainName.DOGECOIN,
          currency: DOGE_CURRENCY_SYMBOL,
          txHash: tx.txid,
          amount: Number(receivedTx.value),
        });
      } catch (e) {
        this.logger.error(e);
        this.logger.error(`could not sync doge coin tx: ${receivedTx.txid}`);
      }
    }
  }

  async upsertEthereumDonations(transfers: AssetTransfersWithMetadataResult[]) {
    for (const transfer of transfers) {
      try {
        const currency = transfer.asset;
        const amount = transfer.value;

        // filter out some spam here
        if (currency === null || amount === null) {
          continue;
        }

        await this.upsert({
          blockchain: ChainName.ETHEREUM,
          blockCreatedAt: new Date(transfer.metadata.blockTimestamp),
          currency: transfer.asset,
          amount: transfer.value,
          blockNumber: ethers.BigNumber.from(transfer.blockNum).toNumber(),
          txHash: transfer.hash,
          fromAddress: ethers.utils.getAddress(transfer.from),
          toAddress: ethers.utils.getAddress(transfer.to),
          currencyContractAddress: transfer.rawContract.address
            ? ethers.utils.getAddress(transfer.rawContract.address)
            : null,
        });
      } catch (e) {
        const message = `could not upsert tx: ${transfer.hash}`;
        this.logger.error(message, e);
        this.sentryClient.instance().captureException(e);
      }
    }
  }

  private async afterGet(donation: Donations) {
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
        donatedCurrencyPrice = await this.coingecko.getCachedPrice('ethereum');
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

    return {
      ...donation,
      currencyUSDNotional,
      explorerUrl,
      fromEns,
      fromMyDogeName,
      fromUD,
    };
  }

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
      data.push(await this.afterGet(donation));
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

  async findFirst(args: Prisma.DonationsFindFirstArgs) {
    const donation = await this.prisma.donations.findFirst(args);
    if (!donation) {
      return donation;
    }
    return this.afterGet(donation);
  }

  async findFirstOrThrow(args: Prisma.DonationsFindFirstOrThrowArgs) {
    const donation = await this.prisma.donations.findFirstOrThrow(args);
    return this.afterGet(donation);
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

  async getLeaderboard(donations: Array<DonationsAfterGet>, prices?: object) {
    const leaderboard = {};
    for (const donation of donations) {
      let donatedCurrencyPrice = 0;
      if (prices?.[donation.currency]) {
        donatedCurrencyPrice = prices[donation.currency];
      } else {
        if (donation.currencyContractAddress) {
          try {
            donatedCurrencyPrice = await this.coingecko.getCachedPrice(
              donation.currencyContractAddress,
            );
          } catch (e) {}
        } else {
          try {
            donatedCurrencyPrice = await this.coingecko.getCachedPrice(
              donation.currency,
            );
          } catch (e) {}
        }
      }

      const oldUsdNotional = donation.amount * donatedCurrencyPrice;
      const address = donation.fromAddress;

      if (Object.keys(leaderboard).includes(address)) {
        leaderboard[address].donations.push(donation);
        leaderboard[address].usdNotional += oldUsdNotional;
      } else {
        leaderboard[address] = {
          myDogeName: donation.fromMyDogeName,
          ens: donation.fromEns,
          ud: donation.fromUD,
          donations: [donation],
          usdNotional: oldUsdNotional,
        };
      }
    }
    return leaderboard;
  }
}
