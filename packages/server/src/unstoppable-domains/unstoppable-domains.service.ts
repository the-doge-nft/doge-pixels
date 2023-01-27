import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Resolution } from '@unstoppabledomains/resolution';
import { CacheService } from './../cache/cache.service';

@Injectable()
export class UnstoppableDomainsService implements OnModuleInit {
  private readonly logger = new Logger(UnstoppableDomainsService.name);
  private resolution: Resolution;

  constructor(private readonly cache: CacheService) {}

  static getNameCacheKey(address: string) {
    return `ud:${address}`;
  }

  async onModuleInit() {
    this.resolution = new Resolution();
  }

  private async reverseUrl(address: string) {
    this.logger.log(`querying ud: ${address}`);
    const ud = await this.resolution.reverse(address);
    return ud;
  }

  async getName(address: string): Promise<string | null> {
    return this.reverseUrl(address);
  }

  async getCachedName(address: string): Promise<string | null> {
    return this.cache.get(UnstoppableDomainsService.getNameCacheKey(address));
  }
}
