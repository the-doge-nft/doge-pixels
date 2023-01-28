import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Balance } from '../donations/donations.service';
import { RainbowSwapsRepository } from '../rainbow-swaps/rainbow-swaps.repository';
import { RainbowSwapsService } from '../rainbow-swaps/rainbow-swaps.service';
import { DonationsRepository } from './../donations/donations.repository';
import { DonationsService } from './../donations/donations.service';

@Injectable()
export class StatueCampaignService implements OnModuleInit {
  private logger = new Logger(StatueCampaignService.name);

  async onModuleInit() {
    this.logger.log('🐕 Statue campaign service init');
    // await this.rainbowSwaps.init();
    // this.donationsService.init();
  }

  constructor(
    private readonly rainbowSwaps: RainbowSwapsService,
    private readonly rainbowSwapsRepo: RainbowSwapsRepository,
    private readonly donationsService: DonationsService,
    private readonly donationsRepo: DonationsRepository,
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
    const donationLeaderBoard = {};
    const swapLeaderBoard = {};
    const donations = await this.donationsService.getLeaderboardDonations();
    const swaps = await this.rainbowSwaps.getValidDonationSwaps();

    for (const donation of donations) {
      const donatedCurrencyPrice = leaderBoardPrices[donation.currency];
      const oldUsdNotional = donation.amount * donatedCurrencyPrice;
      const address = donation.fromAddress;

      if (Object.keys(donationLeaderBoard).includes(address)) {
        donationLeaderBoard[address].donations.push(donation);
        donationLeaderBoard[address].usdNotional += oldUsdNotional;
      } else {
        donationLeaderBoard[address] = {
          myDogeName: donation.fromMyDogeName,
          ens: donation.fromEns,
          ud: donation.fromUD,
          donations: [donation],
          usdNotional: oldUsdNotional,
        };
      }
    }

    for (const swap of swaps) {
      const swapPrice = leaderBoardPrices[swap.donatedCurrency];
      const donatedSwapNotional = swap.donatedAmount * swapPrice;
      const address = swap.clientAddress;
      if (Object.keys(swapLeaderBoard).includes(address)) {
        swapLeaderBoard[address].swaps.push(swap);
        swapLeaderBoard[address].usdNotional += donatedSwapNotional;
      } else {
        swapLeaderBoard[address] = {
          ens: swap.clientEns,
          swaps: [swap],
          usdNotional: donatedSwapNotional,
        };
      }
    }

    const _donations = Object.keys(donationLeaderBoard).map((address) => ({
      address,
      ...donationLeaderBoard[address],
    }));

    const _swaps = Object.keys(swapLeaderBoard).map((address) => ({
      address,
      ...swapLeaderBoard[address],
    }));

    _swaps.sort((a, b) => {
      if (a.usdNotional > b.usdNotional) {
        return -1;
      }
      return 1;
    });
    _donations.sort((a, b) => {
      if (a.usdNotional > b.usdNotional) {
        return -1;
      }
      return 1;
    });
    return { swaps: _swaps, donations: _donations };
  }

  async getNow(): Promise<{
    ethereum: Balance[];
    dogecoin: Balance[];
    swaps: Balance[];
  }> {
    const ethereumBalances = await this.donationsService.getEthereumBalances();
    const dogecoinBalance = await this.donationsService.getDogeBalances();
    const rainbowBalances = await this.rainbowSwaps.getRainbowBalances();
    return {
      ethereum: ethereumBalances,
      dogecoin: [dogecoinBalance],
      swaps: rainbowBalances,
    };
  }
}
