import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string) {
    return this.cache.get<T>(key);
  }

  async set<T>(key: string, value: any, ttl?: number) {
    return this.cache.set<T>(key, value, { ttl });
  }

  async getOrQueryAndCache<T>(
    key: string,
    noDataCallback: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const data = await this.get<T>(key);
    if (data) {
      return data;
    }
    const newData = await noDataCallback();
    await this.set<T>(key, newData, ttl);
    return newData;
  }
}
