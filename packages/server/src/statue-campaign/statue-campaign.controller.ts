import { Controller, Get } from '@nestjs/common';
import { DonationsRepository } from '../donations/donations.repository';
import { RainbowSwapsRepository } from '../rainbow-swaps/rainbow-swaps.repository';
import { StatueCampaignService } from './statue-campaign.service';

@Controller('statue-campaign')
export class DonationController {
  constructor(
    private readonly rainbowSwapRepo: RainbowSwapsRepository,
    private readonly statueService: StatueCampaignService,
    private readonly donationsRepo: DonationsRepository,
  ) {}

  @Get('/swaps')
  getSwaps() {
    return this.rainbowSwapRepo.getSwaps();
  }

  @Get('/donations')
  getDonations() {
    return this.donationsRepo.getMostRecentDonations();
  }

  @Get('/leaderboard')
  async getLeaderboard() {
    // todo:
    // 1: query total notional by ethereum address from donations + rainbow swaps
    // 2: query total notional by doge donations
    // 3: sort notional
    return await this.statueService.getLeaderBoard();
  }

  @Get('/now')
  async getNow() {
    const donationsUsdNotional =
      await this.donationsRepo.getUSDNotionalDonated();
    return {
      usdNotional: donationsUsdNotional,
    };
  }
}
