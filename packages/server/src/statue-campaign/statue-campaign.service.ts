import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RainbowSwapsService } from '../rainbow-swaps/rainbow-swaps.service';

@Injectable()
export class StatueCampaignService implements OnModuleInit {
  private logger = new Logger(StatueCampaignService.name);

  async onModuleInit() {
    this.logger.log('🐕 Statue campaign service init');
    this.rainbowSwaps.init();
  }

  constructor(private readonly rainbowSwaps: RainbowSwapsService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  private syncRainbowSwaps() {
    this.rainbowSwaps.syncRecentDOGSwaps();
  }
}
