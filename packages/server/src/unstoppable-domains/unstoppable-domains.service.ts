import { CACHE_MANAGER, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Resolution } from '@unstoppabledomains/resolution';
import { UnsLocation } from '@unstoppabledomains/resolution/build/types/publicTypes';
import { Cache } from 'cache-manager';

@Injectable()
export class UnstoppableDomainsService implements OnModuleInit {
  private readonly logger = new Logger(UnstoppableDomainsService.name);
  private resolution: Resolution;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async onModuleInit() {
    this.resolution = new Resolution();
    this.logger.log('UD init');
    await this.reverseUrl('0xd801d86C10e2185a8FCBccFB7D7baF0A6C5B6BD5');
  }

  private async reverseUrl(address: string) {
    const ud = await this.resolution.reverse(address);
    this.logger.log(`UD reverse lookup: ${address}:${ud}`);
    return ud
  }

  async getUDName(address: string, withCache = true) {
    const cacheKey = `ud:${address}`;
    const cacheSeconds = 60 * 60 * 5;
    const noUD = 'NOUD';
    if (withCache) {
      const ud = await this.cacheManager.get(cacheKey)
      if (!ud) {
        const freshUD = await this.reverseUrl(address)
        if (freshUD) {
          await this.cacheManager.set(cacheKey, freshUD, {ttl: cacheSeconds})
          return freshUD
        } else {
          await this.cacheManager.set(cacheKey, noUD, {ttl: cacheSeconds})
          return null
        }
      }
      return ud
    } else {
      return this.reverseUrl(address)
    }
  }
}
