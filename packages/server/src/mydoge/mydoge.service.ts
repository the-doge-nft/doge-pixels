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
  private readonly secondsToCache = 60 * 60;

  constructor(
    private readonly http: HttpService,
    private readonly cache: CacheService,
  ) {}

  async getWalletProfile(address: string) {
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
}
