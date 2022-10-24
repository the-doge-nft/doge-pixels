import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RainbowSwapsRepository } from '../rainbow-swaps/rainbow-swaps.repository';
import { RainbowSwapsService } from '../rainbow-swaps/rainbow-swaps.service';

@Injectable()
export class StatueCampaignService implements OnModuleInit {
  private logger = new Logger(StatueCampaignService.name);

  async onModuleInit() {
    this.logger.log('🐕 Statue campaign service init');
    this.rainbowSwaps.init();
  }

  constructor(
    private readonly rainbowSwaps: RainbowSwapsService,
    private readonly rainbowSwapsRepo: RainbowSwapsRepository
    ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  private syncRainbowSwaps() {
    this.rainbowSwaps.syncRecentDOGSwaps();
  }

  async getLeaderBoard() {
    const donations = []
    const swaps = await this.rainbowSwapsRepo.getSwaps()
    swaps.sort((a,b) => {
      if (a.donatedUSDNotional > b.donatedUSDNotional) {
        return -1
      }
      return 1
    })
    return {swaps, donations}
  }
}
