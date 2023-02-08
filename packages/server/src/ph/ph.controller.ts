import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Tx } from '../blockcypher/blockcypher.interfaces';
import { CoinGeckoService } from '../coin-gecko/coin-gecko.service';
import { CacheService } from './../cache/cache.service';
import { AppEnv } from './../config/configuration';
import { PhService, Total } from './ph.service';

export const TOTAL_CACHE_KEY = 'PH:TOTAL';
export const LEADERBOARD_CACHE_KEY = 'PH:LEADERBOARD';

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
  async getLeaderboard() {
    const cache = await this.cache.get(LEADERBOARD_CACHE_KEY);
    if (cache) {
      return cache;
    } else {
      const data = await this.ph.getLeaderboard();
      await this.cache.set(LEADERBOARD_CACHE_KEY, data, 60);
      return data;
    }
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

  @Post('blockcypher/webhook/tx')
  postWebhookTx(@Body() body: Tx) {
    return this.ph.processWebhook(body);
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
