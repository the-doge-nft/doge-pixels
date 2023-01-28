import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Resolution } from '@unstoppabledomains/resolution';
import { CacheService } from './../cache/cache.service';

@Injectable()
export class UnstoppableDomainsService implements OnModuleInit {
  private readonly logger = new Logger(UnstoppableDomainsService.name);
  private resolution: Resolution;
  private readonly secondsToCache = 60 * 60 * 10;

  constructor(private readonly cache: CacheService) {}

  private getNameCacheKey(address: string) {
    return `ud:${address}`;
  }

  async onModuleInit() {
    this.resolution = new Resolution();
  }

  private async reverseUrl(address: string) {
    this.logger.log(`querying ud: ${address}`);
    return this.resolution.reverse(address);
  }

  async getName(address: string): Promise<string | null> {
    return this.reverseUrl(address);
  }

  async getCachedName(address: string): Promise<string | null> {
    return this.cache.get(this.getNameCacheKey(address));
  }

  async refreshNameCache(address: string) {
    return this.cache.set(
      this.getNameCacheKey(address),
      await this.getName(address),
      this.secondsToCache,
    );
  }
}
