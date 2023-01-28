import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
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
  private readonly secondsToCache = 60 * 60 * 10;

  private getNameCacheKey(address: string) {
    return `MYDOGE:PROFILE:${address.toLowerCase()}`;
  }

  constructor(
    private readonly http: HttpService,
    private readonly cache: CacheService,
  ) {}

  async getName(address: string) {
    this.logger.log(`querying ${address}`);
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
    return data?.username;
  }

  getCachedName(address: string) {
    return this.cache.get<typeof address>(this.getNameCacheKey(address));
  }

  async refreshCachedName(address: string) {
    await this.cache.set(
      this.getNameCacheKey(address),
      await this.getName(address),
      this.secondsToCache,
    );
  }
}
