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

  @Get('address')
  async getAddress() {
    const address = await this.ph.getAddress();
    console.log(JSON.stringify(address, null, 2));
    return address;
  }

  @Get('address/full')
  async getAddressFull() {
    const address = await this.ph.getAddressFull();
    console.log(JSON.stringify(address, null, 2));
    return address;
  }
}
