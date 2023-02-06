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
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Tx } from 'src/blockcypher/blockcypher.interfaces';
import { AppEnv } from './../config/configuration';
import { PhService } from './ph.service';

@Controller('ph')
export class PhController {
  private readonly logger = new Logger(PhController.name);
  constructor(
    private readonly ph: PhService,
    private readonly config: ConfigService,
  ) {}

  @Get('balance')
  getBalance() {
    return this.ph.getBalance();
  }

  @Get('donations')
  getDonations() {
    return this.ph.getDonations();
  }

  @Get('leaderboard')
  getLeaderboard() {
    return this.ph.getLeaderboard();
  }

  @Get('address')
  async getAddress() {
    const address = await this.ph.getAddress();
    console.log(JSON.stringify(address, null, 2));
    return address;
  }

  @Get('blockcypher/webhook/create')
  postWebhookCreate() {
    let url = 'https://staging.api.ownthedoge.com/ph/blockcypher/webhook/tx';
    if (this.config.get('AppEnv') === AppEnv.production) {
      url = 'https://api.ownthedoge.com/ph/blockcypher/webhook/tx';
    }
    return this.ph.createWebhook(url);
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

  @Get('sendaping/:id')
  sendAPing(@Param() params: { id: string }) {
    if (this.config.get('AppEnv') === AppEnv.production) {
      throw new BadRequestException('✨no✨');
    }
    return this.ph.DEV_HOOK_PING(Number(params.id)).catch((e) => {
      this.logger.error(e);
      this.logger.error('Could not find donation');
      throw new BadRequestException('Could not find donation');
    });
  }

  @Post('blockcypher/webhook/tx')
  postWebhookTx(@Body() body: Tx, @Req() req: Request) {
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

  @Get('hooks')
  getHooks() {
    return this.ph.getHooks();
  }

  @Get('donations/syncall')
  syncAllDonations() {
    return this.ph.syncAllDonations();
  }
}
