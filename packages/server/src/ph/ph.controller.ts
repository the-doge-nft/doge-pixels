import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfirmedTx } from 'src/blockcypher/blockcypher.interfaces';
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
    return this.ph.createWebhook(
      'https://staging.api.ownthedoge.com/ph/blockcypher/webhook/tx',
    );
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
  postWebhookTx(@Body() body: ConfirmedTx, @Req() req: Request) {
    return this.ph.processWebhook(body);
    // try {
    // const isValid = this.ph.getIsHookPingSafe(req);
    // if (isValid) {
    // this.logger.log('processing valid webhookd');
    // return this.ph.processWebhook(body);
    // } else {
    // this.logger.error('Could not verify webhook');
    // this.logger.error(JSON.stringify(body, null, 2));
    // this.logger.error(JSON.stringify(req.headers, null, 2));
    // throw new BadRequestException("Couldn't verify webhook");
    // }
    // } catch (e) {
    //   this.logger.error('Could not process webhook');
    //   this.logger.error(e);
    //   // this.logger.error(JSON.stringify(body, null, 2));
    //   // this.logger.error(JSON.stringify(req.headers, null, 2));
    //   throw new BadRequestException('Could not verify webhook');
    // }
  }
}
