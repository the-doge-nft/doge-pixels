import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Balance, DonationsService } from '../donations/donations.service';
import { RainbowSwapsRepository } from '../rainbow-swaps/rainbow-swaps.repository';
import { RainbowSwapsService } from '../rainbow-swaps/rainbow-swaps.service';
import { DonationsRepository } from './../donations/donations.repository';

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
    this.rainbowSwaps.syncRecentDOGSwaps();
  }

  @Cron(CronExpression.EVERY_5_HOURS)
  private syncAllRainbowSwaps() {
    this.rainbowSwaps.syncAllDOGSwaps()
  }

  // doge donations
  @Cron(CronExpression.EVERY_MINUTE)
  private syncDogeTxs() {
    this.donationsService.syncRecentDogeDonations();
  }

  @Cron(CronExpression.EVERY_5_HOURS)
  private syncAllDogeDonation() {
    this.donationsService.syncAllDogeDonations()
  }

  // ethereum donations
  @Cron(CronExpression.EVERY_5_MINUTES)
  private syncEthereumDonations() {
    this.donationsService.syncRecentEthereumDonations();
  }

  @Cron(CronExpression.EVERY_5_HOURS)
  private syncAllEthereumDonations() {
    this.donationsService.syncAllEthereumTransfers()
  }

  async getLeaderBoard() {
    const donations = await this.donationsRepo.getMostRecentDonations();
    const swaps = await this.rainbowSwaps.getValidDonationSwaps();
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

  async getNow(): Promise<{
    ethereum: Balance[],
    dogecoin: Balance[],
    swaps: Balance[]
  }> {
    const ethereumBalances = await this.donationsService.getEthereumBalances();
    const dogecoinBalance = await this.donationsService.getDogeBalances();
    const rainbowBalances = await this.rainbowSwaps.getRainbowBalances();
    return {
      ethereum: ethereumBalances,
      dogecoin: [dogecoinBalance],
      swaps: rainbowBalances
    };
  }
}
