import { Controller, Get } from '@nestjs/common';
import { RainbowSwapsRepository } from '../rainbow-swaps/rainbow-swaps.repository';

@Controller('statue-campaign')
export class DonationController {
  constructor(private readonly rainbowSwapRepo: RainbowSwapsRepository) {}

  @Get('/swaps')
  getDonation() {
    return this.rainbowSwapRepo.getSwaps();
  }
}
