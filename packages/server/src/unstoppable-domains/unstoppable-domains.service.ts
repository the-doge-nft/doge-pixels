import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
  OnModuleInit
} from '@nestjs/common';
import { Resolution } from '@unstoppabledomains/resolution';
import { Cache } from 'cache-manager';
import { getRandomIntInclusive } from '../helpers/numbers';

@Injectable()
export class UnstoppableDomainsService implements OnModuleInit {
  private readonly logger = new Logger(UnstoppableDomainsService.name);
  private resolution: Resolution;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async onModuleInit() {
    this.resolution = new Resolution();
  }

  private async reverseUrl(address: string) {
    const ud = await this.resolution.reverse(address);
    this.logger.log(`UD reverse lookup: ${address}:${ud}`);
    return ud;
  }

  async getUDName(address: string, withCache = true): Promise<string | null> {
    const cacheKey = `ud:${address}`;
    const cacheSeconds = getRandomIntInclusive(60 * 60 * 10, 60 * 60 * 24);
    const noUD = 'NOUD';
    if (withCache) {
      const ud = await this.cacheManager.get(cacheKey);
      if (!ud) {
        const freshUD = await this.reverseUrl(address);
        if (freshUD) {
          await this.cacheManager.set(cacheKey, freshUD, { ttl: cacheSeconds });
          return freshUD;
        } else {
          await this.cacheManager.set(cacheKey, noUD, { ttl: cacheSeconds });
          return null;
        }
      } else if (ud === noUD) {
        return null;
      }
      return ud as string;
    } else {
      return this.reverseUrl(address);
    }
  }
}
