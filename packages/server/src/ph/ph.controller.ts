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
import { Tx } from '../blockcypher/blockcypher.interfaces';
import { CoinGeckoService } from '../coin-gecko/coin-gecko.service';
import { CacheService } from './../cache/cache.service';
import { AppEnv } from './../config/configuration';
import { PhService, Total } from './ph.service';

export const TOTAL_CACHE_KEY = 'PH:TOTAL';

@Controller('ph')
// @UseInterceptors(CacheInterceptor)
export class PhController {
  private readonly logger = new Logger(PhController.name);
  constructor(
    private readonly ph: PhService,
    private readonly config: ConfigService,
    private readonly cache: CacheService,
    private readonly coingecko: CoinGeckoService,
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
    return this.ph.getAddress();
  }

  @Get('blockcypher/webhook/create')
  postWebhookCreate() {
    let url = 'https://staging.api.ownthedoge.com/ph/blockcypher/webhook/tx';
    if (this.config.get('isProd')) {
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
      throw new BadRequestException('✨ no thx ✨');
    }
    return this.ph.DEV_HOOK_PING(Number(params.id)).catch((e) => {
      this.logger.error(e);
      this.logger.error('Could not find donation');
      throw new BadRequestException('Could not find donation');
    });
  }

  // @next
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

  @Get('total')
  async getTotal() {
    const cache = await this.cache.get<Total>(TOTAL_CACHE_KEY);
    if (cache) {
      const dogePrice = await this.coingecko.getCachedDogePrice();
      return {
        ...cache,
        dogePrice,
        usdNotional: Number(Number(cache.totalReceived * dogePrice).toFixed(2)),
      };
    } else {
      const data = await this.ph.getTotalReceived();
      await this.cache.set(TOTAL_CACHE_KEY, data, 60 * 30);
      return data;
    }
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
