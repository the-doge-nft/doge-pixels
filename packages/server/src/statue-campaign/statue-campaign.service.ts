import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Campaign, Donations } from '@prisma/client';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { AssetTransfersCategory, AssetTransfersOrder } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { CoinGeckoService } from '../coin-gecko/coin-gecko.service';
import {
  Balance,
  DOGE_CURRENCY_SYMBOL,
  ETH_CURRENCY_SYMBOL,
} from '../donations/donations.service';
import { RainbowSwapsService } from '../rainbow-swaps/rainbow-swaps.service';
import { AlchemyService } from './../alchemy/alchemy.service';
import { BlockcypherService } from './../blockcypher/blockcypher.service';
import { DonationsService } from './../donations/donations.service';
import { SochainService } from './../sochain/sochain.service';

@Injectable()
export class StatueCampaignService implements OnModuleInit {
  private logger = new Logger(StatueCampaignService.name);

  private txIdsToFilter = [
    '0x1bd3cbae22469b3801eea1d336818034443a4849f37b8c3de4cb178d9ba8ad96',
    '0xe396d17f229b01eea8cc1e3c6c799019660f8706fde500235d8119c4df8e0529',
    '0x79e50251330c2bfe16c176f5286408a95cb4b0f696c502ec54318d3cc4b6ba0b',
    '0x6f412bb523f4521025801a42dbeea5a3e3109ad6a3d9821e9e85300847bd51c4',
    '0x481e730947648be7005e0c336b69b32741fdbc07c4555a2ab7db923fd788b2b0',
    '0x7aeab291e207abee000c9074bf9c5e2222673dbb0c485efc77db33593999234b',
    '0x0714a47f7e33807a183f67dc5a8c7024ce9347e819231454727ec0960aee88ed',
  ];

  myDogeAddress = 'D8HjKf37rF3Ho7tjwe17MPN8xQ2UbHSUhB';
  private soDogeTipAddress = 'D7XihpaUjiCqvPrky2xEyfvgoJeUjMKQ6E';
  ethereumAddress = '0x633aC73fB70247257E0c3A1142278235aFa358ac';

  async onModuleInit() {
    this.logger.log('🐕 Statue campaign service init');
    this.init();
  }

  init() {
    // this.syncEthereumTransfers();
    // this.syncAllDogeDonations();
  }

  constructor(
    private readonly rainbowSwaps: RainbowSwapsService,
    private readonly donations: DonationsService,
    private readonly alchemy: AlchemyService,
    private readonly coingecko: CoinGeckoService,
    private readonly blockcypher: BlockcypherService,
    private readonly sochain: SochainService,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  // doge donations
  // @Cron(CronExpression.EVERY_5_MINUTES)
  // private syncDogeTxs() {
  //   this.donationsService.syncRecentDogeDonations();
  // }

  // @Cron(CronExpression.EVERY_5_HOURS)
  // private syncAllDogeDonation() {
  //   this.donationsService.syncAllDogeDonations();
  // }

  async syncEthereumTransfers() {
    const transfers = await this.getEthereumTransfers();
    await this.donations.upsertEthereumDonations(transfers);
  }

  private async getEthereumTransfers(fromBlock?: string) {
    const data = await this.alchemy.getAssetTransfers({
      order: AssetTransfersOrder.ASCENDING,
      toAddress: this.ethereumAddress,
      category: [AssetTransfersCategory.ERC20, AssetTransfersCategory.EXTERNAL],
      maxCount: 1000,
      withMetadata: true,
      fromBlock,
    });
    if (data.pageKey) {
      throw new Error("There is paging data and we don't support currently");
    }
    return data?.transfers;
  }

  async getLeaderBoard() {
    const leaderBoardPrices = {
      USDC: 1,
      USDT: 1,
      DOGE: 0.097843873,
      BAL: 6.16,
      ETH: 1_271.55,
      WETH: 1_271.55,
      DOG: 0.000724,
      SNX: 1.9,
      NFD: 0.00002311,
      WAVAX: 13.67,
      SHIB: 0.000009314,
      SOCKS: 25_253.53,
      RADAR: 0.00585,
      MKR: 631.76,
      TRIBE: 0.2087,
      stETH: 1_250.13,
      CAT: 0.1032,
      GRO: 0.09822,
      WBTC: 17_051.8,
      FREE: 0.00007354,
      RARE: 0.1253,
      MATIC: 0.9174,
      SOS: 0.0000001113,
      GRT: 0.06423,
    };
    const donationLeaderBoard = await this.donations.getLeaderboard(
      await this.getDonationsLeaderboard(),
      leaderBoardPrices,
    );

    const swapLeaderBoard = this.rainbowSwaps.getLeaderboard(
      await this.rainbowSwaps.getValidDonationSwaps(),
      leaderBoardPrices,
    );

    const donations = Object.keys(donationLeaderBoard)
      .map((address) => ({
        address,
        ...donationLeaderBoard[address],
      }))
      .sort((a, b) => {
        if (a.usdNotional > b.usdNotional) {
          return -1;
        }
        return 1;
      });

    const swaps = Object.keys(swapLeaderBoard)
      .map((address) => ({
        address,
        ...swapLeaderBoard[address],
      }))
      .sort((a, b) => {
        if (a.usdNotional > b.usdNotional) {
          return -1;
        }
        return 1;
      });
    return { swaps, donations };
  }

  private async getEthBalance() {
    const eth = await this.alchemy.getBalance(this.ethereumAddress);
    const usdPrice = await this.coingecko.getCachedEthPrice();
    const amount = Number(ethers.utils.formatEther(ethers.BigNumber.from(eth)));
    const usdNotional = usdPrice * amount;
    return { symbol: ETH_CURRENCY_SYMBOL, usdPrice, usdNotional, amount };
  }

  private async getEthereumBalances(): Promise<Balance[]> {
    const balances: Balance[] = [];
    try {
      balances.push(await this.getEthBalance());
    } catch (e) {}

    const erc20 = await this.alchemy.getTokenBalances(this.ethereumAddress);
    for (const balance of erc20) {
      const { contractAddress } = balance;
      if (
        !this.donations.blackListedContractAddresses.includes(
          balance.contractAddress,
        )
      ) {
        try {
          const metadata = await this.alchemy.getTokenMetadata(contractAddress);
          const symbol = metadata.symbol;
          const decimals = metadata.decimals;
          const amount = ethers.BigNumber.from(balance.tokenBalance)
            .div(ethers.BigNumber.from(10).pow(decimals))
            .toNumber();
          const usdPrice = await this.coingecko.getCachedPrice(contractAddress);
          const usdNotional = usdPrice * amount;
          balances.push({
            symbol,
            usdPrice,
            usdNotional,
            amount,
          });
        } catch (e) {
          this.logger.error(
            `Could not get balance for: ${balance.contractAddress}`,
          );
          this.sentryClient.instance().captureException(e);
        }
      }
    }
    return balances;
  }

  async getNow(): Promise<{
    ethereum: Balance[];
    dogecoin: Balance[];
    swaps: Balance[];
  }> {
    const ethereumBalances = await this.getEthereumBalances();
    const dogecoinBalance = await this.getDogeBalances();
    const rainbowBalances = await this.rainbowSwaps.getRainbowBalances();
    return {
      ethereum: ethereumBalances,
      dogecoin: [dogecoinBalance],
      swaps: rainbowBalances,
    };
  }

  async getAllDonations() {
    return this.donations.findMany({
      orderBy: {
        blockCreatedAt: 'desc',
      },
      where: {
        fromAddress: {
          notIn: [this.myDogeAddress, this.soDogeTipAddress],
        },
        txHash: {
          notIn: this.txIdsToFilter,
        },
      },
    });
  }

  async getDonationsLeaderboard() {
    // donations end at 12/6 ETC
    return this.donations.findMany({
      orderBy: {
        blockCreatedAt: 'desc',
      },
      where: {
        fromAddress: {
          notIn: [this.myDogeAddress, this.soDogeTipAddress],
        },
        blockCreatedAt: {
          lte: new Date('2022-12-07T05:10:59Z'),
        },
        txHash: {
          notIn: this.txIdsToFilter,
        },
        campaign: Campaign.STATUE,
      },
    });
  }

  async getDogeBalances(): Promise<Balance> {
    const myDogeBalance = await this.blockcypher.getBalance(this.myDogeAddress);
    const soDogeBalance = await this.blockcypher.getBalance(
      this.soDogeTipAddress,
    );
    const totalBalance = myDogeBalance + soDogeBalance;
    const dogePrice = await this.coingecko.getCachedDogePrice();
    return {
      symbol: DOGE_CURRENCY_SYMBOL,
      amount: totalBalance,
      usdNotional: totalBalance * dogePrice,
      usdPrice: dogePrice,
    };
  }

  async syncAllDogeDonations() {
    await this.syncAllDogeDonationsForAddress(this.myDogeAddress);
    await this.syncAllDogeDonationsForAddress(this.soDogeTipAddress);
  }

  async syncAllDogeDonationsForAddress(address: string) {
    this.logger.log(`Syncing all dogecoin donations for address: ${address}`);
    const receivedTxs = await this.sochain.getAllTxsReceivedToAddress(address);
    await this.donations.upsertDogeDonations(receivedTxs, address);
  }

  async syncRecentDogeDonations() {
    this.syncMostRecentDogeDonationsForAddress(this.myDogeAddress);
    this.syncMostRecentDogeDonationsForAddress(this.soDogeTipAddress);
  }

  private async syncMostRecentDogeDonationsForAddress(address: string) {
    const mostRecentDonation =
      await this.donations.getMostRecentDogeDonationForAddress(address);
    try {
      if (mostRecentDonation) {
        await this.syncDogeDonationsFromMostRecent(mostRecentDonation);
      } else {
        await this.syncAllDogeDonationsForAddress(address);
      }
    } catch (e) {
      this.logger.error(
        `Could not sync Doge donations for address: ${address}`,
      );
      this.sentryClient.instance().captureException(e);
    }
  }

  private async syncDogeDonationsFromMostRecent(donation: Donations) {
    this.logger.log(
      `Syncing dogecoin donations from block number ${donation.blockNumber} : hash ${donation.txHash}`,
    );
    // check if there are any new txs past our most recent synced tx
    const donations = await this.sochain.getAllTxsReceivedToAddress(
      donation.toAddress,
      donation.txHash,
    );
    await this.donations.upsertDogeDonations(donations, donation.toAddress);
  }
}
