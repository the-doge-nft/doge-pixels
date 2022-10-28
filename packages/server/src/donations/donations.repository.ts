import { Injectable } from '@nestjs/common';
import { ChainName, Prisma } from '@prisma/client';
import { AlchemyService } from '../alchemy/alchemy.service';
import { CoinGeckoService } from '../coin-gecko/coin-gecko.service';
import { EthersService } from '../ethers/ethers.service';
import { PrismaService } from './../prisma.service';

@Injectable()
export class DonationsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ethers: EthersService,
    private readonly alchemy: AlchemyService,
    private readonly coingecko: CoinGeckoService,
  ) {}

  upsert(donation: Prisma.DonationsCreateInput) {
    return this.prisma.donations.upsert({
      where: { txHash: donation.txHash },
      update: {},
      create: {
        ...donation,
      },
    });
  }

  findMany(args: Prisma.DonationsFindManyArgs) {
    return this.prisma.donations.findMany(args);
  }

  async getMostRecentDogeDonation() {
    return (
      await this.prisma.donations.findMany({
        where: {
          blockchain: ChainName.DOGE,
          currency: 'DOGE',
        },
        orderBy: { blockCreatedAt: 'desc' },
      })
    )?.[0];
  }
}
