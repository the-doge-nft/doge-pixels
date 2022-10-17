import { Controller, Get } from '@nestjs/common';
import { DonateService } from './donate.service';

@Controller('donate')
export class DonateController {
  constructor(private doanteService: DonateService) {}

  @Get('/donars')
  getTest() {
    return this.doanteService.getDonars();
  }

  @Get('/swappers')
  getSwappers() {
    return this.doanteService.getSwappers();
  }
}
