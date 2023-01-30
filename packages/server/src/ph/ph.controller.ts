import { Controller, Get } from '@nestjs/common';
import { PhService } from './ph.service';

@Controller('ph')
export class PhController {
  constructor(private readonly ph: PhService) {}

  @Get('balance')
  getBalance() {
    return this.ph.getBalance();
  }

  @Get('leaderboard')
  getLeaderboard() {
    return this.ph.getBalance();
  }
}
