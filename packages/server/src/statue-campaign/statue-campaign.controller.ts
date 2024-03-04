import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
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
  ) {}

  // @CacheKey('STATUECAMPAIGN:SWAPS')
  // @CacheTTL(30)
  @Get('/swaps')
  getSwaps() {
    return this.rainbowSwapService.getAllDonationSwaps();
  }

  // @CacheKey('STATUECAMPAIGN:DONATIONS')
  // @CacheTTL(30)
  @Get('/donations')
  getDonations() {
    return this.statueService.getAllDonations();
  }

  // @CacheKey('STATUECAMPAIGN:LEADERBOARD')
  // @CacheTTL(30)
  @Get('/leaderboard')
  async getLeaderboard() {
    return await this.statueService.getLeaderBoard();
  }

  @CacheKey('STATUECAMPAIGN:NOW')
  @CacheTTL(60 * 2)
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
    const dogecoinAddress = this.statueService.myDogeAddress;
    const ethereumAddress = this.statueService.ethereumAddress;
    return {
      dogecoinAddress,
      ethereumAddress,
    };
  }

  @CacheKey('STATUECAMPAIGN:SYCNALLDOGEDONATIONS')
  @CacheTTL(30)
  @Get('/sync/doge')
  async syncAllDoge() {
    await this.statueService.syncAllDogeDonations();
    return { success: true };
  }

  @CacheKey('STATUECAMPAIGN:SYCNALLETHDONATIONS')
  @CacheTTL(30)
  @Get('/sync/eth')
  async syncAllEth() {
    await this.statueService.syncEthereumTransfers();
    return { success: true };
  }

  @CacheKey('STATUECAMPAIGN:SYCNALLETHDONATIONS')
  @CacheTTL(30)
  @Get('/sync/swaps')
  async syncAllSwaps() {
    await this.rainbowSwapService.syncAllNetworks();
    return { success: true };
  }
}
