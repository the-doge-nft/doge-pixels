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
    // const addresses = await this.getEthereumDonationCurrencyAddresses();
    try {
      const promises = [
        this.coingecko.refreshDogePrice(),
        this.coingecko.refreshEthPrice(),
        this.coingecko.refreshDogPrice(),
      ];
      // if (addresses.length > 0) {
      //   promises.push(
      //     this.coingecko.refreshPricesByEthereumContractAddresses(addresses),
      //   );
      // }
      await Promise.all(promises);
    } catch (e) {}
  }

  get wow() {
    return '✨🐕wow🐕✨'.repeat(5);
  }

  // private async getEthereumDonationCurrencyAddresses() {
  //   const donations = await this.donations.findMany({
  //     where: {
  //       blockchain: ChainName.ETHEREUM,
  //       currencyContractAddress: { not: null },
  //     },
  //   });
  //   const swaps = await this.rainbowSwapsRepo.findMany({
  //     where: { donatedCurrencyAddress: { not: null } },
  //   });
  //   const donationAddresses = donations.map(
  //     (donation) => donation.currencyContractAddress,
  //   );
  //   const swapAddresses = swaps.map((swap) => swap.donatedCurrencyAddress);
  //   return Array.from(new Set(donationAddresses.concat(swapAddresses)));
  // }

  // private async getDogeAddresses() {
  //   const donations = await this.donations.findMany({
  //     where: {
  //       blockchain: ChainName.DOGECOIN,
  //       currency: DOGE_CURRENCY_SYMBOL,
  //     },
  //   });
  //   const fromAddresses = donations.map((donation) => donation.fromAddress);
  //   const toAddresses = donations.map((donation) => donation.toAddress);
  //   const uniqueAddresses = Array.from(
  //     new Set(fromAddresses.concat(toAddresses)),
  //   );
  //   return uniqueAddresses;
  // }

  private async getEthereumAddresses(): Promise<string[]> {
    // const donations = await this.donations.findMany({
    //   where: { blockchain: ChainName.ETHEREUM },
    // });
    // const swaps = await this.swapsRepo.findMany();
    const pixelTransfers = await this.pixelTranserRepo.findMany();

    // const fromAddress = donations.map((donation) => donation.fromAddress);
    // const toAddresses = donations.map((donation) => donation.toAddress);
    // const swapAddresses = swaps.map((swap) => swap.clientAddress);
    const pixelFromAddresses = pixelTransfers.map((transfer) => transfer.from);
    const pixelToAddresses = pixelTransfers.map((transfer) => transfer.to);

    // const allAddresses: string[] = fromAddress.concat(
    // toAddresses,
    // swapAddresses,
    // pixelFromAddresses,
    // pixelToAddresses,
    // );

    const allAddresses: string[] = pixelFromAddresses.concat(pixelToAddresses);

    const uniqueAddresses = Array.from(new Set(allAddresses));
    return uniqueAddresses;
  }
}
