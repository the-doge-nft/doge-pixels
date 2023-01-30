import { Body, Controller, Get, Post } from '@nestjs/common';
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

  @Post('blockcypher/webhook/create')
  postWebhookCreate(@Body() body: any) {
    return this.ph.createWebhook(body);
  }

  @Get('blockcypher/webhook/create')
  getWebhooks() {
    return this.ph.getWebhooks();
  }

  @Post('blockcypher/webhook/tx')
  postWebhookTx(@Body() body: any) {
    return this.ph.processBody(body);
  }
}
