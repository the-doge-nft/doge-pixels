import { CacheInterceptor, CacheKey, CacheTTL, Controller, Get, UseInterceptors } from '@nestjs/common';
import { DonationsRepository } from '../donations/donations.repository';
import { DonationsService } from '../donations/donations.service';
import { RainbowSwapsRepository } from '../rainbow-swaps/rainbow-swaps.repository';
import { RainbowSwapsService } from '../rainbow-swaps/rainbow-swaps.service';
import { StatueCampaignService } from './statue-campaign.service';

@Controller('statue-campaign')
@UseInterceptors(CacheInterceptor)
export class DonationController {
  constructor(
    private readonly rainbowSwapRepo: RainbowSwapsRepository,
    private readonly rainbowSwapService: RainbowSwapsService,
    private readonly statueService: StatueCampaignService,
    private readonly donationsRepo: DonationsRepository,
    private readonly donationsService: DonationsService
  ) {}

  @CacheKey('STATUECAMPAIGN:SWAPS')
  @CacheTTL(30)
  @Get('/swaps')
  getSwaps() {
    return this.rainbowSwapService.getValidDonationSwaps();
  }

  @CacheKey('STATUECAMPAIGN:DONATIONS')
  @CacheTTL(30)
  @Get('/donations')
  getDonations() {
    return this.donationsRepo.getMostRecentDonations();
  }

  @CacheKey('STATUECAMPAIGN:LEADERBOARD')
  @CacheTTL(30)
  @Get('/leaderboard')
  async getLeaderboard() {
    // @next -- update this to be per address
    return await this.statueService.getLeaderBoard();
  }

  @CacheKey('STATUECAMPAIGN:NOW')
  @CacheTTL(30)
  @Get('/now')
  async getNow() {
    const now = await this.statueService.getNow();
    let usdNotional = 0;
    now.ethereum.forEach((bal) => (usdNotional += bal.usdNotional));
    now.dogecoin.forEach((bal) => (usdNotional += bal.usdNotional));
    now.swaps.forEach((bal) => (usdNotional += bal.usdNotional));
    return {
      usdNotional,
      ...now,
    };
  }

  @CacheKey('STATUECAMPAIGN:CONFIRM')
  @CacheTTL(30)
  @Get('/confirm')
  async confirm() {
    const dogecoinAddress = this.donationsService.dogeCoinAddress
    const ethereumAddress = this.donationsService.ethereumAddress
    return {
      dogecoinAddress,
      ethereumAddress
    }
  }
}
