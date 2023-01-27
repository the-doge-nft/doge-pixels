import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { TEN_HOURS_SECONDS } from '../app.service';
import { CacheService } from '../cache/cache.service';

interface Profile {
  address: string;
  avatarUrl: string;
  username: string;
}

@Injectable()
export class MydogeService {
  private logger = new Logger(MydogeService.name);
  private readonly baseUrl = 'https://api.mydoge.com';
  private readonly secondsToCache = 60 * 60;

  private getNameCacheKey(address: string) {
    return `MYDOGE:PROFILE:${address}`;
  }

  constructor(
    private readonly http: HttpService,
    private readonly cache: CacheService,
  ) {}

  async getName(address: string) {
    const profile = await this.cache.getOrQueryAndCache(
      `MYDOGE:PROFILE:${address}`,
      async () => {
        const { data } = await firstValueFrom(
          this.http
            .get<Profile>(this.baseUrl + '/wallet/' + address + '/profile')
            .pipe(
              catchError((e) => {
                if (e.response) {
                  this.logger.log(e.response);
                }
                this.logger.error(e);
                throw new Error(`Could not get profile address ${address}`);
              }),
            ),
        );
        return data;
      },
      this.secondsToCache,
    );
    return profile?.username;
  }

  getCachedName(address: string) {
    return this.cache.get<typeof address>(this.getNameCacheKey(address));
  }

  async refreshCachedName(address: string) {
    const name = await this.getName(address);
    await this.cache.set(
      this.getNameCacheKey(address),
      name,
      TEN_HOURS_SECONDS,
    );
  }
}
