import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ChainName } from '@prisma/client';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { AlchemyService } from './alchemy/alchemy.service';
import { CacheService } from './cache/cache.service';
import { CoinGeckoService } from './coin-gecko/coin-gecko.service';
import {
  DOGE_CURRENCY_SYMBOL,
  DonationsRepository,
} from './donations/donations.repository';
import { EthersService } from './ethers/ethers.service';
import { MydogeService } from './mydoge/mydoge.service';
import { PixelTransferRepository } from './pixel-transfer/pixel-transfer.repository';
import { RainbowSwapsRepository } from './rainbow-swaps/rainbow-swaps.repository';
import { UnstoppableDomainsService } from './unstoppable-domains/unstoppable-domains.service';

export const TEN_HOURS_SECONDS = 60 * 60 * 10;

@Injectable()
export class AppService implements OnModuleInit {
  private logger = new Logger(AppService.name);

  constructor(
    private readonly alchemy: AlchemyService,
    private readonly ethers: EthersService,
    private readonly donationsRepo: DonationsRepository,
    private readonly cache: CacheService,
    private readonly myDoge: MydogeService,
    private readonly swapsRepo: RainbowSwapsRepository,
    private readonly pixelTranserRepo: PixelTransferRepository,
    private readonly ud: UnstoppableDomainsService,
    private readonly coingecko: CoinGeckoService,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  onModuleInit() {
    this.syncNames();
  }

  syncNames() {
    Promise.all([
      this.cacheDogeNames(),
      this.cacheUdNames(),
      this.cacheEnsNames(),
      this.cachePrices(),
    ]).then(() => this.logger.log('Name cache done syncing'));
  }

  async cacheDogeNames() {
    const donations = await this.donationsRepo.findMany({
      where: {
        blockchain: ChainName.DOGECOIN,
        currency: DOGE_CURRENCY_SYMBOL,
      },
    });
    for (const donation of donations) {
      await this.myDoge.refreshCachedName(donation.fromAddress);
      await this.myDoge.refreshCachedName(donation.toAddress);
    }
  }

  async cacheUdNames() {
    const addresses = await this.getEthereumAddresses();
    for (const address of addresses) {
      await this.ud.refreshNameCache(address);
    }
  }

  async cacheEnsNames() {
    const addresses = await this.getEthereumAddresses();
    for (const address of addresses) {
      await this.ethers.refreshEnsCache(address);
    }
  }

  private async getEthereumAddresses(): Promise<string[]> {
    const donations = await this.donationsRepo.findMany({
      where: { blockchain: ChainName.ETHEREUM },
    });
    const swaps = await this.swapsRepo.findMany();
    const pixelTransfers = await this.pixelTranserRepo.findMany();

    const fromAddress = donations.map((donation) => donation.fromAddress);
    const toAddresses = donations.map((donation) => donation.toAddress);
    const swapAddresses = swaps.map((swap) => swap.clientAddress);
    const pixelFromAddresses = pixelTransfers.map((transfer) => transfer.from);
    const pixelToAddresses = pixelTransfers.map((transfer) => transfer.to);

    const allAddresses: string[] = fromAddress.concat(
      toAddresses,
      swapAddresses,
      pixelFromAddresses,
      pixelToAddresses,
    );

    const uniqueAddresses = Array.from(new Set(allAddresses));
    return uniqueAddresses;
  }

  async cachePrices() {
    const dogePrice = await this.coingecko.getDogePrice();
    const dogPrice = await this.coingecko.getDOGUSDPrice();
    const ethPrice = await this.coingecko.getETHPrice();
  }

  get wow() {
    return (
      '░░░░░░░░░▄░░░░░░░░░░░░░░▄░░░░\n' +
      '░░░░░░░░▌▒█░░░░░░░░░░░▄▀▒▌░░░\n' +
      '░░░░░░░░▌▒▒█░░░░░░░░▄▀▒▒▒▐░░░\n' +
      '░░░░░░░▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐░░░\n' +
      '░░░░░▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐░░░\n' +
      '░░░▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌░░░ \n' +
      '░░▐▒▒▒▄▄▒▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒▌░░\n' +
      '░░▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐░░\n' +
      '░▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄▌░\n' +
      '░▌░▒▄██▄▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒▌░\n' +
      '▐▒▀▐▄█▄█▌▄░▀▒▒░░░░░░░░░░▒▒▒▐░\n' +
      '▐▒▒▐▀▐▀▒░▄▄▒▄▒▒▒▒▒▒░▒░▒░▒▒▒▒▌\n' +
      '▐▒▒▒▀▀▄▄▒▒▒▄▒▒▒▒▒▒▒▒░▒░▒░▒▒▐░\n' +
      '░▌▒▒▒▒▒▒▀▀▀▒▒▒▒▒▒░▒░▒░▒░▒▒▒▌░\n' +
      '░▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▒▄▒▒▐░░\n' +
      '░░▀▄▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▄▒▒▒▒▌░░\n' +
      '░░░░▀▄▒▒▒▒▒▒▒▒▒▒▄▄▄▀▒▒▒▒▄▀░░░\n' +
      '░░░░░░▀▄▄▄▄▄▄▀▀▀▒▒▒▒▒▄▄▀░░░░░\n' +
      '░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▀▀░░░░░░░░\n' +
      'wow\n'
    );
  }
}
