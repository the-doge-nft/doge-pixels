import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Resolution } from '@unstoppabledomains/resolution';
import { UnsLocation } from '@unstoppabledomains/resolution/build/types/publicTypes';

@Injectable()
export class UnstoppableDomainsService implements OnModuleInit {
  private readonly logger = new Logger(UnstoppableDomainsService.name);
  private resolution: Resolution;

  async onModuleInit() {
    this.resolution = new Resolution();
    this.logger.log('UD init');
    await this.reverseUrl('0xd801d86C10e2185a8FCBccFB7D7baF0A6C5B6BD5');
  }

  async reverseUrl(address: string) {
    const data = await this.resolution.reverse(address);
    this.logger.log(`UD reverse lookup: ${JSON.stringify(data)}`);
  }
}
