import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
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
    private readonly rainbowSwapsRepo: RainbowSwapsRepository,
    @InjectSentry() private readonly sentryClient: SentryService,
  ) {}

  onModuleInit() {
    this.cacheNames();
    this.cachePrices();
  }

  @Cron(CronExpression.EVERY_5_HOURS)
  cacheNames() {
    Promise.all([
      this.cacheDogeNames(),
      this.cacheUdNames(),
      this.cacheEnsNames(),
    ]);
  }

  async cacheDogeNames() {
    const addresses = await this.getDogeAddresses();
    for (const address of addresses) {
      try {
        await this.myDoge.refreshCachedName(address);
      } catch (e) {}
    }
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
    const addresses = await this.getEthereumDonationCurrencyAddresses();
    try {
      await Promise.all([
        this.coingecko.refreshDogePrice(),
        this.coingecko.refreshEthPrice(),
        this.coingecko.refreshDogPrice(),
        this.coingecko.refreshPricesByEthereumContractAddresses(addresses),
      ]);
    } catch (e) {}
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

  private async getEthereumDonationCurrencyAddresses() {
    const donations = await this.donationsRepo.findMany({
      where: {
        blockchain: ChainName.ETHEREUM,
        currencyContractAddress: { not: null },
      },
    });
    const swaps = await this.rainbowSwapsRepo.findMany({
      where: { donatedCurrencyAddress: { not: null } },
    });
    const donationAddresses = donations.map(
      (donation) => donation.currencyContractAddress,
    );
    const swapAddresses = swaps.map((swap) => swap.donatedCurrencyAddress);
    return Array.from(new Set(donationAddresses.concat(swapAddresses)));
  }

  private async getDogeAddresses() {
    const donations = await this.donationsRepo.findMany({
      where: {
        blockchain: ChainName.DOGECOIN,
        currency: DOGE_CURRENCY_SYMBOL,
      },
    });
    const fromAddresses = donations.map((donation) => donation.fromAddress);
    const toAddresses = donations.map((donation) => donation.toAddress);
    const uniqueAddresses = Array.from(
      new Set(fromAddresses.concat(toAddresses)),
    );
    return uniqueAddresses;
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
}
