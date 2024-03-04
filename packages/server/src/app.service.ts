import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CoinGeckoService } from './coin-gecko/coin-gecko.service';
// import { DonationsService } from './donations/donations.service';
import { EthersService } from './ethers/ethers.service';
import { MydogeService } from './mydoge/mydoge.service';
import { PixelTransferRepository } from './pixel-transfer/pixel-transfer.repository';
import { UnstoppableDomainsService } from './unstoppable-domains/unstoppable-domains.service';

@Injectable()
export class AppService implements OnModuleInit {
  private logger = new Logger(AppService.name);

  constructor(
    private readonly ethers: EthersService,
    private readonly myDoge: MydogeService,
    private readonly pixelTranserRepo: PixelTransferRepository,
    private readonly ud: UnstoppableDomainsService,
    private readonly coingecko: CoinGeckoService,
  ) {}

  onModuleInit() {
    this.cacheNames();
    this.cachePrices();
  }

  @Cron(CronExpression.EVERY_5_HOURS)
  async cacheNames() {
    await Promise.all([this.cacheUdNames(), this.cacheEnsNames()]);
  }

  async cacheUdNames() {
    const addresses = await this.getEthereumAddresses();
    for (const address of addresses) {
      try {
        await this.ud.refreshNameCache(address);
      } catch (e) {}
    }
  }

  async cacheEnsNames() {
    const addresses = await this.getEthereumAddresses();
    for (const address of addresses) {
      try {
        await this.ethers.refreshEnsCache(address);
      } catch (e) {}
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async cachePrices() {
    try {
      const promises = [
        this.coingecko.refreshDogePrice(),
        this.coingecko.refreshEthPrice(),
        this.coingecko.refreshDogPrice(),
      ];
      await Promise.all(promises);
    } catch (e) {}
  }

  get wow() {
    return '✨🐕wow🐕✨'.repeat(5);
  }

  private async getEthereumAddresses(): Promise<string[]> {
    const pixelTransfers = await this.pixelTranserRepo.findMany();
    const pixelFromAddresses = pixelTransfers.map((transfer) => transfer.from);
    const pixelToAddresses = pixelTransfers.map((transfer) => transfer.to);
    const allAddresses: string[] = pixelFromAddresses.concat(pixelToAddresses);
    return Array.from(new Set(allAddresses));
  }
}
