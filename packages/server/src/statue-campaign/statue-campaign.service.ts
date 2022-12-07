import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
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
    this.rainbowSwaps.init();
    this.donationsService.init();
  }

  constructor(
    private readonly rainbowSwaps: RainbowSwapsService,
    private readonly rainbowSwapsRepo: RainbowSwapsRepository,
    private readonly donationsService: DonationsService,
    private readonly donationsRepo: DonationsRepository,
  ) {}

  // rainbow swaps
  @Cron(CronExpression.EVERY_5_MINUTES)
  private syncRainbowSwaps() {
    this.rainbowSwaps.syncRecentDOGSwapsForAllNetworks();
  }

  @Cron(CronExpression.EVERY_HOUR)
  private syncAllRainbowSwaps() {
    this.rainbowSwaps.syncAllNetworks();
  }

  // doge donations
  @Cron(CronExpression.EVERY_MINUTE)
  private syncDogeTxs() {
    this.donationsService.syncRecentDogeDonations();
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  private syncAllDogeDonation() {
    this.donationsService.syncAllDogeDonations();
  }

  // ethereum donations
  @Cron(CronExpression.EVERY_10_MINUTES)
  private syncEthereumDonations() {
    this.donationsService.syncRecentEthereumDonations();
  }

  @Cron(CronExpression.EVERY_HOUR)
  private syncAllEthereumDonations() {
    this.donationsService.syncAllEthereumTransfers();
  }

  async getLeaderBoard() {
    const donationLeaderBoard = {};
    const swapLeaderBoard = {};
    const donations = await this.donationsService.getLeaderboardDonations();
    const swaps = await this.rainbowSwaps.getValidDonationSwaps();

    for (const donation of donations) {
      const address = donation.fromAddress;
      if (Object.keys(donationLeaderBoard).includes(address)) {
        donationLeaderBoard[address].donations.push(donation);
        donationLeaderBoard[address].usdNotional +=
          donation.currencyUSDNotional;
      } else {
        donationLeaderBoard[address] = {
          myDogeName: donation.fromMyDogeName,
          ens: donation.fromEns,
          ud: donation.fromUD,
          donations: [donation],
          usdNotional: donation.currencyUSDNotional,
        };
      }
    }

    for (const swap of swaps) {
      const address = swap.clientAddress;
      if (Object.keys(swapLeaderBoard).includes(address)) {
        swapLeaderBoard[address].swaps.push(swap);
        swapLeaderBoard[address].usdNotional += swap.donatedUSDNotional;
      } else {
        swapLeaderBoard[address] = {
          ens: swap.clientEns,
          swaps: [swap],
          usdNotional: swap.donatedUSDNotional,
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
