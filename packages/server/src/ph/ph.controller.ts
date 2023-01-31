import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PhService } from './ph.service';

@Controller('ph')
export class PhController {
  private readonly logger = new Logger(PhController.name);
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

  @Get('blockcypher/webhook/create')
  postWebhookCreate() {
    return this.ph.createWebhook();
  }

  @Get('blockcypher/webhook')
  getWebhooks() {
    return this.ph.listWebhooks();
  }

  @Get('blockcypher/webhook/delete/:id')
  deleteWebhook(@Param() params: { id: string }) {
    return this.ph.deleteWebhook(params.id);
  }

  @Get('blockcypher/webhook/:id')
  getWebhookById(@Param() params: { id: string }) {
    return this.ph.getWebhookById(params.id);
  }

  @Post('blockcypher/webhook/tx')
  postWebhookTx(@Body() body: any, @Req() req: Request) {
    if (this.ph.isHookPingSafe(req)) {
      return this.ph.processWebhook(body);
    } else {
      this.logger.error('Could not process webhook');
      this.logger.error(JSON.stringify(body, null, 2));
      this.logger.error(req);
      throw new BadRequestException('Could not verify webhook');
    }
  }
}
