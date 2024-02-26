import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private NULL = 'NULL';
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string) {
    const data = await this.cache.get<T>(key);
    return data === this.NULL ? null : data;
  }

  set<T>(key: string, value?: any, ttl?: number) {
    return this.cache.set(key, value === null ? this.NULL : value);
  }

  del(key: string) {
    return this.cache.del(key);
  }

  async getOrQueryAndCache<T>(
    key: string,
    getData: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const data = await this.get<T>(key);
    if (data) {
      return data;
    }
    const newData = await getData();
    await this.set<T>(key, newData, ttl);
    return newData;
  }
}
