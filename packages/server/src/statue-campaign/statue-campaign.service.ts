import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DonationsService } from '../donations/donations.service';
import { RainbowSwapsRepository } from '../rainbow-swaps/rainbow-swaps.repository';
import { RainbowSwapsService } from '../rainbow-swaps/rainbow-swaps.service';
import { DonationsRepository } from './../donations/donations.repository';

@Injectable()
export class StatueCampaignService implements OnModuleInit {
  private logger = new Logger(StatueCampaignService.name);

  async onModuleInit() {
    this.logger.log('🐕 Statue campaign service init');
    this.rainbowSwaps.init();
  }

  constructor(
    private readonly rainbowSwaps: RainbowSwapsService,
    private readonly rainbowSwapsRepo: RainbowSwapsRepository,
    private readonly donationsService: DonationsService,
    private readonly donationsRepo: DonationsRepository,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  private syncRainbowSwaps() {
    this.rainbowSwaps.syncRecentDOGSwaps();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  private syncDogeTxs() {
    this.donationsService.syncRecentDogeDonations();
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // private syncEthereumDonations() {
  //   this.donationsService.syncEthereumDonations();
  // }

  async getLeaderBoard() {
    const donations = await this.donationsRepo.getMostRecentDonations();
    const swaps = await this.rainbowSwapsRepo.getSwaps();
    swaps.sort((a, b) => {
      if (a.donatedUSDNotional > b.donatedUSDNotional) {
        return -1;
      }
      return 1;
    });
    donations.sort((a, b) => {
      if (a.currencyUSDNotional > b.currencyUSDNotional) {
        return -1;
      }
      return 1;
    });
    return { swaps, donations };
  }
}
